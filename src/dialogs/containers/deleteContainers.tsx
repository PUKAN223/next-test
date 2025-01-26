import handleSubmitDelete from "@/app/pages/containers/admin/handles/forms/DeleteSubmit"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type Props = {
    deleteOpen: { open: boolean, data: any },
    onSetDeleteOpen: (t: boolean) => void,
    user: string,
    role: string,
    onUpdate: () => void;
}

export default function DialogDeleteContainers({ deleteOpen, onSetDeleteOpen, user, role, onUpdate }: Props) {
    return (
        <AlertDialog open={deleteOpen.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>คุณต้องการลบคลังสินค้า{(deleteOpen.data)?.name ?? ""}ใช่หรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                        การลบครั้งนี้ไม่สามารถกู้คืนกลับมาได้, คุณเเน่ใจที่จะลบหรือไม่
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel id="cancelBtnC" onClick={() => onSetDeleteOpen(false)}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction id="deleteBtnC" color={"red"} onClick={() => {
                        handleSubmitDelete((deleteOpen as any).data._id as string, user, role, onSetDeleteOpen, onUpdate)
                    }}>ลบ</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}