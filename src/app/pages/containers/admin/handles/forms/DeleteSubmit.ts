import { getContainers } from '@/functions/stock/get';
import { toast } from 'sonner';
import Histories from '@/props/Histories';
import Container from '@/props/Containers';

export default function handleSubmitDelete(
    id: string,
    username: string,
    role: string,
    onSetDeleteOpen: (t: boolean) => void,
    onUpdate: () => void
) {
    const submitButton = document.getElementById("deleteBtnC") as HTMLButtonElement;
    const cancelButton = document.getElementById("cancelBtnC") as HTMLButtonElement;
    if (submitButton) {
        submitButton.disabled = true;
        cancelButton.disabled = true;
        submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
    }
    fetch(`/api/stock/containers/get/${id}`)
        .then(res => res.json())
        .then((data: Container & { _id: string }) => {
            fetch(`/api/stock/containers/delete/${id}`, {
                method: "DELETE"
            }).then(res => {
                delete data["_id"]
                toast("ลบคลังสินค้าสำเร็จ")
                fetch(`/api/stock/histories/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: data, action: "delete", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as unknown as Histories),
                }).then(res => res.json())
                    .then(_res => {
                        submitButton.disabled = false;
                        cancelButton.disabled = false;
                        submitButton.innerHTML = `ลบ`
                        onSetDeleteOpen(false)
                        onUpdate()
                    })
            })
        })
}

function getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}