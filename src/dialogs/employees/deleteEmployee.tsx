import handleSubmitDelete from "@/app/pages/containers/admin/handles/forms/DeleteSubmit"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Employees from "@/props/Employees"
import { toast } from "sonner"

type Props = {
    deleteOpen: { open: boolean, data: Employees },
    onSetDeleteOpen: (t: boolean) => void,
    user: string,
    role: string,
    onUpdate: () => void
}

export default function DialogDeleteEmployees({ deleteOpen, onSetDeleteOpen, user, role, onUpdate }: Props) {
    return (
        <AlertDialog open={deleteOpen.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>คุณต้องการลบพนักงานใช่หรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                        การลบครั้งนี้ไม่สามารถกู้คืนกลับมาได้, คุณเเน่ใจที่จะลบหรือไม่
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel id="cancelBtnE" onClick={() => onSetDeleteOpen(false)}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction id="deleteBtnE" color={"red"} onClick={() => {
                        const data = deleteOpen.data as Employees & { _id: string }
                        const submitButton = document.getElementById("deleteBtnE") as HTMLButtonElement
                        const cancelButton = document.getElementById("cancelBtnE") as HTMLButtonElement

                        if (submitButton) {
                            submitButton.disabled = true
                            cancelButton.disabled = true
                            submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
                        }

                        fetch(`/api/employees/delete/${data._id}`, {
                            method: "DELETE"
                        })
                            .then(res => {
                                if (res.status !== 200) {
                                    window.location.reload()
                                } else {
                                    submitButton.disabled = false
                                    cancelButton.disabled = false
                                    submitButton.innerHTML = `ส่ง`
                                    onUpdate()
                                    onSetDeleteOpen(false)
                                    toast("ลบพนักงานสำเร็จ")
                                }
                            })
                    }}>ลบ</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}