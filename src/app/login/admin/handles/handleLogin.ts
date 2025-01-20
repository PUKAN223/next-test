import formSchema from "@/schemas/LoginFormSchema";
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export default async function handleLogin(
    data: { username: string; password: string },
    setErrors: Dispatch<SetStateAction<{ user: string; password: string }>>,
    router: AppRouterInstance,
    onReset: () => void
): Promise<void> {
    const { username, password } = data;
    const errors: { user: string; password: string } = { user: null, password: null };
    const checkSchema = formSchema.safeParse(data);

    if (checkSchema.success) {
        errors.password = null;
        errors.user = null;

        const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

        try {
            const type = "general"
            const res = await signIn("credentials", { username, password, type, role: "admin", redirect: false });

            if (res?.error) {
                toast.error("", { description: "ชื่อผู้ใช้เเละรหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง", position: "top-right" })
                onReset()
                return null;
            }

            router.push("/pages/dashboards/admin");
        } catch (e) {
            console.error(e);
        }
    } else {
        const Errors = checkSchema.error?.errors;
        Errors.forEach((err) => {
            if (err.path.includes("username")) {
                errors.user = err.message;
            } else if (err.path.includes("password")) {
                errors.password = err.message;
            }
        });
    }

    setErrors(errors);
}