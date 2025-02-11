import { Dispatch, FormEvent, SetStateAction } from 'react';
import fileToBase64 from "@/functions/fileToBase64";
import { ContainerSchema } from "@/schemas/Containers";
import { toast } from 'sonner';
import Histories from '@/props/Histories';

export default function handleSubmitAdd(
    event: FormEvent<HTMLFormElement>,
    errorsM: { name: null; category: null; description: null; logo: null },
    setErrorsM: Dispatch<SetStateAction<{ name: null; category: null; description: null; logo: null }>>,
    username: string,
    role: string,
    onAddOpen: (t: boolean) => void,
    logo: File,
    form: any,
) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formObject: Record<string, any> = {};
    formData.forEach((value, key) => {
        formObject[key as "name"] = value as any;
    });
    const logoFile = logo;

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

                    formObject["stock"] = [];
                    formObject["createBy"] = username;
                    ((event.target as any)[5] as HTMLButtonElement).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
                    fetch(`/api/stock/containers/add`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formObject),
                    }).then(res => {
                        submitButton.disabled = false;
                        cancelButton.disabled = false;
                        ((event.target as any)[5] as HTMLButtonElement).innerHTML = `ส่ง`
                        toast.success("เพิ่งคลังสินค้าสำเร็จ")
                        fetch(`/api/stock/histories/add`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ data: formObject, action: "import", timeStamp: new Date().toLocaleDateString('en-GB'), createBy: username + ` (${role})`} as Histories),
                        }).then(res => res.json())
                            .then(_res => {
                                form.reset()
                                onAddOpen(false)
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
