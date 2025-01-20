import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import handleSubmitAdd from "@/app/pages/containers/admin/handles/forms/AddSubmit";
import { z } from "zod";

type Props = {
    addOpen: boolean;
    onSetAddOpen: (t: boolean) => void;
    schema: any;
    user: string;
    role: string;
}

export default function DialogAddContainers({ addOpen, onSetAddOpen, schema, user, role }: Props) {
    const [errors, setErrors] = useState({
        name: null,
        category: null,
        description: null,
        logo: null
    });
    const [logo, setLogo] = useState<File | null>(null);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            category: "",
            description: ""
        },
    });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLogo(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmitAdd(e as any, errors, setErrors, user, role, onSetAddOpen, logo, form);
    };

    return (
        <Dialog open={addOpen} onOpenChange={(o) => onSetAddOpen(o)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มคลังสินค้า</DialogTitle>
                    <DialogDescription>
                        สามารถเพิ่มคลังสินค้าได้ที่นี่, คลิ๊กปุ่มส่งเพื่อเพิ่มคลังสินค้า
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="w-full space-y-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ</FormLabel>
                                    {errors.name && (
                                        <span className="text-red-500 text-xs italic"> *{errors.name}</span>
                                    )}
                                    <FormControl>
                                        <Input {...field} placeholder="Enter name" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>หมวดหมู่</FormLabel>
                                    {errors.category && (
                                        <span className="text-red-500 text-xs italic"> *{errors.category}</span>
                                    )}
                                    <FormControl>
                                        <Input {...field} placeholder="Enter category" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>หมายเหตุ</FormLabel>
                                    {errors.description && (
                                        <span className="text-red-500 text-xs italic"> *{errors.description}</span>
                                    )}
                                    <FormControl>
                                        <Input {...field} placeholder="Enter description" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>รูปสินค้า</FormLabel>
                                    {errors.logo && (
                                        <span className="text-red-500 text-xs italic"> *{errors.logo}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleFileChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end" }} className="space-x-2">
                            <Button className="w-[70px]" type="button" variant={"ghost"} onClick={() => onSetAddOpen(false)}>ยกเลิก</Button>
                            <Button className="w-[90px]" type="submit">ส่ง</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
