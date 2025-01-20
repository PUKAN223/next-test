import handleSubmitEdit from "@/app/pages/containers/admin/handles/forms/EditSubmit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    editOpen: boolean;
    onSetEditOpen: (t: boolean) => void;
    schema: any,
    editData: any,
    user: string,
    role: string
}

export default function DialogEditContainers({ editOpen, onSetEditOpen, editData, schema, user, role }: Props) {
    const [errors, setErrors] = useState({
        name: null,
        category: null,
        description: null,
        logo: null
    });
    const EditForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            category: "",
            description: "",
            logo: ""
        },
    });

    useEffect(() => {
        EditForm.reset({
            name: (editData as any)?.name ?? "",
            category: (editData as any)?.category ?? "",
            description: (editData as any)?.description ?? "",
            logo: ""
        });
    }, [editData])

    return (
        <Dialog open={editOpen} onOpenChange={(o) => onSetEditOpen(o)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มคลังสินค้า</DialogTitle>
                    <DialogDescription>
                        สามารถเพิ่มคลังสินค้าได้ที่นี่, คลิ๊กปุ่มส่งเพื่อเพิ่มคลังสินค้า
                    </DialogDescription>
                </DialogHeader>
                <Form {...EditForm}>
                    <form onSubmit={(e) => handleSubmitEdit(e, errors, setErrors, (editData as any)._id, user, role, onSetEditOpen)} className="w-full space-y-3">
                        <FormField
                            control={EditForm.control}
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
                            control={EditForm.control}
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
                            control={EditForm.control}
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
                            control={EditForm.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>รูปสินค้า</FormLabel>
                                    {errors.logo && (
                                        <span className="text-red-500 text-xs italic"> *{errors.logo}</span>
                                    )}
                                    <FormControl>
                                        <Input
                                            type="file" {...field}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <br></br>
                        <div style={{ display: "flex", justifyContent: "flex-end" }} className="space-x-2">
                            <Button className="w-[70px]" type="button" variant={"ghost"} onClick={() => onSetEditOpen(false)}>ยกเลิก</Button>
                            <Button className="w-[90px]" type="submit" id={"editBtn"}>ส่ง</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}