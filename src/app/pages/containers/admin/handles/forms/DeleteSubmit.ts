import { getContainers } from '@/functions/stock/get';
import { toast } from 'sonner';
import Histories from '@/props/Histories';

export default function handleSubmitDelete(
    id: string,
    username: string,
    role: string,
    onSetDeleteOpen: (t: boolean) => void
) {
    const submitButton = getElementByXpath('//*[@id="radix-:rh:"]/div[2]/button[2]') as HTMLButtonElement;
    const cancelButton = getElementByXpath('//*[@id="radix-:rh:"]/div[2]/button[1]') as HTMLButtonElement;
    if (submitButton) {
        submitButton.disabled = true;
        cancelButton.disabled = true;
        submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
    }
    getContainers(id).then(data => {
        fetch(`http://localhost:3000/api/stock/containers/delete/${id}`, {
            method: "DELETE"
        }).then(_res => {
            delete data[0]["_id"]
            toast("ลบคลังสินค้าสำเร็จ")
            fetch(`http://localhost:3000/api/stock/histories/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: data[0], action: "delete", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as unknown as Histories),
            }).then(res => res.json())
                .then(_res => {
                    submitButton.disabled = false;
                    cancelButton.disabled = false;
                    submitButton.innerHTML = `ลบ`
                    onSetDeleteOpen(false)
                })
        })
    })
}

function getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}