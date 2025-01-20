import { Dispatch, FormEvent, SetStateAction } from 'react';
import fileToBase64 from "@/functions/fileToBase64";
import { ContainerSchema } from "@/schemas/Containers";
import { addContainers } from "@/functions/stock/add"
import { editContainers } from '@/functions/stock/edit';
import { deleteContainers } from '@/functions/stock/delete';
import { getContainers } from '@/functions/stock/get';
import { number } from 'zod';
import Container from '@/props/Containers';
import Stocks from '@/props/Stocks';
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
    const data = getContainers(id).then(data => {
        fetch(`http://localhost:3000/api/stock/containers/delete/${id}`, {
            method: "DELETE"
        }).then(res => {
            delete data[0]["_id"]
            toast("ลบคลังสินค้าสำเร็จ")
            fetch(`http://localhost:3000/api/stock/histories/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: data[0], action: "delete", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as unknown as Histories),
            }).then(res => res.json())
                .then(res => {
                    submitButton.disabled = false;
                    cancelButton.disabled = false;
                    submitButton.innerHTML = `ลบ`
                    onSetDeleteOpen(false)
                })
        })
    })
}


function getFormattedDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = String(now.getFullYear()).slice(2); // Get last two digits of the year

    return `${day}-${month}-${year}`;
}

function getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}