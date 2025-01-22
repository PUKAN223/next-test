'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editContainers } from "@/functions/stock/edit";
import { getContainers } from "@/functions/stock/get";
import Container from "@/props/Containers";
import Histories from "@/props/Histories";
import Stocks from "@/props/Stocks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the Stock type
export interface Stock {
    expiryDate: string;
    createAt: string;
    costPrice: number;
    amount: number
    sellPrice: number;
}

// Zod schema for validating stock data
const stockSchema = z.object({
    expiryDate: z.string().min(1, "Required"),
    createAt: z.string().min(1, "Required"),
    costPrice: z.number().min(0, "Only Positive number"),
    amount: z.number().min(0, "Only Positive number"),
    sellPrice: z.number().min(0, "Only Positive number"),
});

type Props = {
    addOpen: boolean;
    onSetAddOpen: (t: boolean) => void;
    schema: any;
    data: {
        _id: string,
        stock: Stocks[]
    },
    onAddProduct: (newProduct: Stocks) => void;
    username: string,
    role: string
};

export default function DialogAddProducts({ addOpen, onSetAddOpen, schema, data, onAddProduct, username, role }: Props) {
    const [errors, setErrors] = useState({
        expiryDate: null,
        createAt: null,
        costPrice: null,
        sellPrice: null,
    });

    const form = useForm<z.infer<typeof stockSchema>>({
        defaultValues: {
            expiryDate: "",
            createAt: "",
            costPrice: 0,
            amount: 0,
            sellPrice: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof stockSchema>) => {
        setErrors({
            expiryDate: null,
            createAt: null,
            costPrice: null,
            sellPrice: null,
        });

        const parsedValues = {
            ...values,
            createAt: new Date().toISOString(),
            amount: parseFloat(values.amount.toString()),
            costPrice: parseFloat(values.costPrice.toString()),
            sellPrice: parseFloat(values.sellPrice.toString()),
            expiryDate: values.expiryDate,
        };
        const result = stockSchema.safeParse(parsedValues);

        if (!result.success) {
            const newErrors: any = {};
            result.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            return;
        } else {
            console.log("t", data)
            const submitButton = document.getElementsByClassName("addP1").item(0) as HTMLButtonElement//cancelP1
            const cancelButton = document.getElementsByClassName("cancelP1").item(0) as HTMLButtonElement
            if (submitButton) {
                submitButton.disabled = true;
                cancelButton.disabled = true;
                submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
            }
            fetch(`${process.env.API_URL}/api/stock/containers/get/${data._id}`)
                .then(res => res.json())
                .then((res: Container) => {
                    const containers = res
                    containers.stock.push(parsedValues)
                    delete (containers as any)["_id"]
                    fetch(`${process.env.API_URL}/api/stock/containers/edit/${data._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(containers),
                    })
                        .then(res => res.json())
                        .then(res => {
                            fetch(`${process.env.API_URL}/api/stock/histories/add`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ data: { ...containers, stock: [parsedValues] }, action: "import", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as Histories),
                            }).then(res => res.json())
                                .then(res => {
                                    submitButton.disabled = false;
                                    cancelButton.disabled = false;
                                    submitButton.innerHTML = `ส่ง`
                                    onAddProduct(containers as any)
                                    onSetAddOpen(false);
                                    toast("เพิ่มสินค้าสำเร็จ")
                                    form.reset()
                                })
                        })

                })
        }
    };

    return (
        <Dialog open={addOpen} onOpenChange={(o) => onSetAddOpen(o)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มสินค้า</DialogTitle>
                    <DialogDescription>สามารถเพิ่มสินค้าที่นี่</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                        {/* Expiry Date */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>จำนวน</FormLabel>
                                    {errors.expiryDate && (
                                        <span className="text-red-500 text-xs italic"> *{errors.expiryDate}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter amount"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>วันหมดอายุ</FormLabel>
                                    {errors.expiryDate && (
                                        <span className="text-red-500 text-xs italic"> *{errors.expiryDate}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="date"
                                            placeholder="Enter expiry date"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="costPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ราคาทุน</FormLabel>
                                    {errors.costPrice && (
                                        <span className="text-red-500 text-xs italic"> *{errors.costPrice}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter cost price"
                                            step="0.01"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Sell Price */}
                        <FormField
                            control={form.control}
                            name="sellPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ราคาขาย</FormLabel>
                                    {errors.sellPrice && (
                                        <span className="text-red-500 text-xs italic"> *{errors.sellPrice}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter sell price"
                                            step="0.01"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <br></br>
                        <div style={{ display: "flex", justifyContent: "flex-end" }} className="space-x-2">
                            <Button
                                className="w-[70px] cancelP1"
                                type="button"
                                variant={"ghost"}
                                onClick={() => onSetAddOpen(false)}
                            >
                                ยกเลิก
                            </Button>
                            <Button className="w-[90px] addP1" type="submit">
                                ส่ง
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}


function getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}