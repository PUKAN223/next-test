import { Dispatch, FormEvent, SetStateAction } from 'react';
import fileToBase64 from "@/functions/fileToBase64";
import { ContainerSchema } from "@/schemas/Containers";
import { toast } from 'sonner';
import Histories from '@/props/Histories';

export default function handleSubmitEdit(
    event: FormEvent<HTMLFormElement>,
    errorsM: { name: null; category: null; description: null; logo: null },
    setErrorsM: Dispatch<SetStateAction<{ name: null; category: null; description: null; logo: null }>>,
    id: string,
    username: string,
    role: string,
    onSetEditOpen: (t: boolean) => void
) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formObject: Record<string, any> = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    const logoFile = formObject["logo"];

    if (logoFile instanceof File) {
        fileToBase64(logoFile)
            .then(base64 => {
                formObject["logo"] = base64;
                if (formObject["description"] == "") {
                    formObject["description"] = "-";
                }
                const result = ContainerSchema.safeParse({
                    ...formObject,
                    logo: base64.split(",")[1]
                });

                if (!result.success) {
                    const errorMessages: Record<string, string | null> = {
                        name: null,
                        category: null,
                        description: null,
                        logo: null
                    };
                    result.error.errors.forEach(e => {
                        errorMessages[e.path[0]] = e.message;
                    });

                    setErrorsM(errorMessages as any);
                } else {
                    setErrorsM({
                        name: null,
                        category: null,
                        description: null,
                        logo: null
                    });

                    const submitButton = (event.target as any)[5] as HTMLButtonElement;
                    const cancelButton = (event.target as any)[4] as HTMLButtonElement;
                    if (submitButton) {
                        submitButton.disabled = true;
                        cancelButton.disabled = true
                    }
                    ((event.target as any)[5] as HTMLButtonElement).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
                    fetch(`http://localhost:3000/api/stock/containers/edit/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formObject),
                    }).then(res => {
                        submitButton.disabled = false;
                        cancelButton.disabled = false;
                        ((event.target as any)[5] as HTMLButtonElement).innerHTML = `ส่ง`
                        toast.success("เเก้ไขคลังสินค้าสำเร็จ")
                        fetch(`http://localhost:3000/api/stock/histories/add`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ data: formObject, action: "edit", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as unknown as Histories),
                        }).then(res => res.json())
                            .then(_res => {
                                onSetEditOpen(false)
                            })
                    })
                }
            })
            .catch(err => {
                console.error("File conversion error:", err);
            });
    } else {
        const result = ContainerSchema.safeParse(formObject);
        if (!result.success) {
            const errorMessages: Record<string, string | null> = {
                name: null,
                category: null,
                description: null,
                logo: null
            };

            result.error.errors.forEach(e => {
                errorMessages[e.path[0]] = e.message;
            });

            setErrorsM(errorMessages as any);
        }
    }
}
