import { useState, useRef, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { EmployeeSchema } from "@/schemas/Employees";
import { Toggle } from "@/components/ui/toggle";

type Props = {
    addOpen: boolean;
    onSetAddOpen: (t: boolean) => void;
    schema: typeof EmployeeSchema;
    user: string;
    role: string;
}

export default function DialogAddEmployees({ addOpen, onSetAddOpen, schema, user, role }: Props) {
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const handleToggle = (gender: string) => {
        setSelectedGender(gender);
    };

    const [logo, setLogo] = useState<File | null>(null);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            profileName: "",
            age: 18,
            gender: "",
        },
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLogo(e.target.files[0]);
        }
    };

    // Handle form submission
    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        console.log("Form Data: ", ev.target);
        console.log("Selected Gender: ", selectedGender);
        console.log("Uploaded Image: ", logo);
    };

    return (
        <Dialog open={addOpen} onOpenChange={(o) => onSetAddOpen(o)}>
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
                                    <FormControl>
                                        <div className="flex justify-between w-full">
                                            <Toggle
                                                variant="outline"
                                                style={{
                                                    width: '48%',
                                                    backgroundColor: selectedGender === 'male' ? 'black' : '',
                                                    color: selectedGender === 'male' ? 'white' : 'gray',
                                                }}
                                                onClick={() => handleToggle('male')}
                                                className="space-x-2"
                                            >
                                                <IconMdiGenderMale />
                                                Male
                                            </Toggle>
                                            <Toggle
                                                variant="outline"
                                                style={{
                                                    width: '48%',
                                                    backgroundColor: selectedGender === 'female' ? 'black' : '',
                                                    color: selectedGender === 'female' ? 'white' : 'gray',
                                                }}
                                                onClick={() => handleToggle('female')}
                                                className="space-x-2"
                                            >
                                                <IconMdiGenderFemale />
                                                Female
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
                                    <FormLabel>รูปสินค้า</FormLabel>
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
