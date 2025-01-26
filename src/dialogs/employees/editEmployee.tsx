import { useState, useRef, FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { EmployeeSchema } from "@/schemas/Employees";
import { Toggle } from "@/components/ui/toggle";
import fileToBase64 from "@/functions/fileToBase64";
import { randomCode } from "@/functions/randomCode";
import { toast } from "sonner";
import Employees from "@/props/Employees";

type Props = {
    editOpen: boolean;
    onSetEditOpen: (t: boolean) => void;
    schema: typeof EmployeeSchema;
    user: string;
    role: string;
    editData: Employees;
    onUpdate: () => void
}

export default function DialogEditEmployees({ editOpen, onSetEditOpen, schema, user, role, onUpdate, editData }: Props) {
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const handleToggle = (gender: string) => {
        setSelectedGender(gender);
    };

    const [logo, setLogo] = useState<File | null>(null);
    const [errors, setErrors] = useState<{
        profileName: string,
        age: string,
        gender: string,
        image: string
    }>({
        profileName: null,
        age: null,
        gender: null,
        image: null
    })
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            profileName: "",
            age: 18
        },
    });

    useEffect(() => {
        if (editData) {
            form.reset({
                profileName: `${editData.profile.name}`,
                age: editData.profile.age
            })
            setSelectedGender(editData.profile.gender)
        }
    }, [editData])

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLogo(e.target.files[0]);
        }
    };

    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formObject: any = {};
        formData.forEach((value, key) => {
            if (key == "age") {
                formObject[key as "name"] = parseInt(value as any)
            } else {
                formObject[key as "name"] = value as any;
            }
        });
        if (logo instanceof File) {
            fileToBase64(logo)
                .then(base64 => {
                    formObject["image"] = base64;
                    formObject["gender"] = selectedGender
                    const validation = schema.safeParse(formObject)
                    console.log(validation.success ?? "s")
                    if (!validation.success) {
                        const errorMessages: Record<string, string | null> = {
                            name: null,
                            category: null,
                            description: null,
                            logo: null
                        };
                        validation.error.errors.forEach(e => {
                            errorMessages[e.path[0]] = e.message;
                        });

                        setErrors(errorMessages as any);
                    } else {
                        const errorMessages: Record<string, string | null> = {
                            name: null,
                            category: null,
                            description: null,
                            logo: null
                        };

                        setErrors(errorMessages as any);

                        const submitButton = document.getElementById("emploAddBtn") as HTMLButtonElement;
                        const cancelButton = document.getElementById("emploCancelBtn") as HTMLButtonElement;
                        if (submitButton) {
                            submitButton.disabled = true;
                            cancelButton.disabled = true
                        }
                        submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
                        fetch(`/api/employees/edit/${(editData as any)._id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username: editData.username,
                                password: editData.password,
                                profile: {
                                    name: formObject["profileName"],
                                    age: formObject["age"],
                                    gender: formObject["gender"],
                                    image: formObject["image"]
                                }
                            })
                        })
                            .then(res => {
                                if (res.status !== 200) {
                                    window.location.reload()
                                } else {
                                    toast("เเก้ไขพนักงานสำเร็จ")
                                    submitButton.disabled = false;
                                    cancelButton.disabled = false;
                                    submitButton.innerHTML = `ส่ง`,
                                    form.reset()
                                    setLogo(null)
                                    setSelectedGender(null)
                                    onUpdate()
                                    onSetEditOpen(false)
                                }
                            })
                        /**
                         * username: string,
    password: string,
    profile: [
        name: string,
        age: number,
        gender: string,
        image: string
    ]
                         */
                    }
                })
        } else {
            formObject["gender"] = selectedGender
            const validation = schema.safeParse(formObject)
            console.log(validation.success ?? "s")
            if (!validation.success) {
                const errorMessages: Record<string, string | null> = {
                    name: null,
                    category: null,
                    description: null,
                    logo: null
                };
                validation.error.errors.forEach(e => {
                    errorMessages[e.path[0]] = e.message;
                });

                setErrors(errorMessages as any);
            }
        }
    };

    return (
        <Dialog open={editOpen} onOpenChange={(o) => onSetEditOpen(o)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มพนักงาน</DialogTitle>
                    <DialogDescription>
                        สามารถเพิ่มพนักงานได้ที่นี่, คลิ๊กปุ่มส่งเพื่อเพิ่มพนักงาน
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="w-full space-y-3">
                        <FormField
                            control={form.control}
                            name="profileName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ</FormLabel>
                                    {errors.profileName && (
                                        <span className="text-red-500 text-xs italic"> *{errors.profileName}</span>
                                    )}
                                    <FormControl>
                                        <Input {...field} placeholder="Enter name" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>อายุ</FormLabel>
                                    {errors.age && (
                                        <span className="text-red-500 text-xs italic"> *{errors.age}</span>
                                    )}
                                    <FormControl>
                                        <Input {...field} placeholder="Enter age" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>เพศ</FormLabel>
                                    {errors.gender && (
                                        <span className="text-red-500 text-xs italic"> *{errors.gender}</span>
                                    )}
                                    <FormControl>
                                        <div className="flex justify-between w-full">
                                            <Toggle
                                                variant="outline"
                                                style={{
                                                    width: '48%',
                                                    backgroundColor: selectedGender === 'ชาย' ? 'black' : '',
                                                    color: selectedGender === 'ชาย' ? 'white' : 'gray',
                                                }}
                                                onClick={() => handleToggle('ชาย')}
                                                className="space-x-2"
                                            >
                                                <IconMdiGenderMale />
                                                ชาย
                                            </Toggle>
                                            <Toggle
                                                variant="outline"
                                                style={{
                                                    width: '48%',
                                                    backgroundColor: selectedGender === 'หญิง' ? 'black' : '',
                                                    color: selectedGender === 'หญิง' ? 'white' : 'gray',
                                                }}
                                                onClick={() => handleToggle('หญิง')}
                                                className="space-x-2"
                                            >
                                                <IconMdiGenderFemale />
                                                หญิง
                                            </Toggle>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>รูปพนักงาน</FormLabel>
                                    {errors.image && (
                                        <span className="text-red-500 text-xs italic"> *{errors.image}</span>
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
                            <Button className="w-[70px]" type="button" variant={"ghost"} id="emploCancelBtn" onClick={() => onSetEditOpen(false)}>ยกเลิก</Button>
                            <Button className="w-[90px]" type="submit" id="emploAddBtn">ส่ง</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export const IconMdiGenderMale = ({
    height = "1em",
    fill = "currentColor",
    focusable = "false",
    ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
    <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height={height}
        focusable={focusable}
        {...props}
    >
        <path
            fill={fill}
            d="M9 9c1.29 0 2.5.41 3.47 1.11L17.58 5H13V3h8v8h-2V6.41l-5.11 5.09c.7 1 1.11 2.2 1.11 3.5a6 6 0 0 1-6 6a6 6 0 0 1-6-6a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4"
        />
    </svg>
);

export const IconMdiGenderFemale = ({
    height = "1em",
    fill = "currentColor",
    focusable = "false",
    ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
    <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height={height}
        focusable={focusable}
        {...props}
    >
        <path
            fill={fill}
            d="M12 4a6 6 0 0 1 6 6c0 2.97-2.16 5.44-5 5.92V18h2v2h-2v2h-2v-2H9v-2h2v-2.08c-2.84-.48-5-2.95-5-5.92a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4"
        />
    </svg>
);
