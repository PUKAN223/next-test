"use client";

import Card from "@/components/Card";
import PageTitle from "@/components/PageTitle";
import CardData from "@/configs/CardDatas";
import { replaceData } from "@/functions/replace-data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTables";
import { ColumnDefBase } from "@tanstack/react-table";
import Container from "@/props/Containers";
import { ContainerData } from "@/configs/ContainersData";
import { useDialogData } from "@/hooks/use-dialog";
import { ContainerSchema } from "@/schemas/Containers";
import DialogAddContainers from "@/dialogs/containers/addContainers";
import DialogExportContainers from "@/dialogs/containers/exportContainers";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Histories from "@/props/Histories";
import { string } from "zod";

export default function Containers() {
    const { data: session, status } = useSession()
    const [amountData, setAmountData] = useState<string[]>(["0", "0", "0", ""]);
    const [columns, setColumns] = useState<ColumnDefBase<Container>[]>([]);
    const [data, setData] = useState<({ _id: string } & Container)[]>([]);
    const [addOpen, setAddOpen, addData, setAddData] = useDialogData()
    const [exportOpen, setExportOpen, exportData, setExportData] = useDialogData()
    const [isUpdate, SetIsUpdate] = useState<boolean>(false)
    useEffect(() => {
        if (!session) redirect("/")
        
        setColumns(ContainerData)
        const fetchData = async () => {
            const response = await fetch(`/api/stock/containers/get`)
            const response1 = await fetch(`/api/stock/histories/get`)
            const data = await response.json()
            const histories = (await response1.json() as { data: Histories[] }).data
            const month = new Date().toLocaleDateString('en-GB').split("/")[1]
            const year = new Date().toLocaleDateString('en-GB').split("/")[2]
            const exportAmount = histories.filter(x => x.action == "export").filter(x => x.timeStamp.split("/")[2] == year).filter((x) => x.timeStamp.split("/")[1] == month).map(x => x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            const deleteAmount = histories.filter(x => x.action == "delete").filter(x => x.timeStamp.split("/")[2] == year).filter((x) => x.timeStamp.split("/")[1] == month).filter(x => x.data.stock.length > 0).map(x => x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            const importAmount = histories.filter(x => x.action == "import").filter(x => x.timeStamp.split("/")[2] == year).filter((x) => x.timeStamp.split("/")[1] == month).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            setData((data as (Container & { _id: string })[]).reverse().filter(x => x.createBy == session.user.username))
            setAmountData([`${data.length}`, `${(data as Container[]).map(x => x.stock.map(x => x.amount).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)}`, `${exportAmount}`, `${importAmount - deleteAmount}`])
        }
        fetchData()
    }, [isUpdate])

    return (
        <div className="flex flex-col gap-5 w-full">
            <PageTitle title="คลังสินค้า" />
            <DialogExportContainers exportOpen={exportOpen} onExportOpen={(o) => { setExportOpen(o); SetIsUpdate(!isUpdate) }} data={data as unknown as (Container[] & { _id: string })} role={session.user.role} username={session.user.username}></DialogExportContainers>
            <DialogAddContainers addOpen={addOpen} onSetAddOpen={(t) => {setAddOpen(t); SetIsUpdate(!isUpdate) }} schema={ContainerSchema} user={session.user.username} role={session.user.role} />
            <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
                {CardData["containers"].map((d, i) => (
                    <Card
                        key={i}
                        amount={replaceData(d.amount, [amountData[i] || "0"])}
                        discription={d.discription}
                        icon={d.icon}
                        label={d.label}
                    />
                ))}
            </section>
            <div className="forms flex gap-4">
                <Button className="w-[95px]" onClick={() => setAddOpen(true)}>เพิ่มสินค้า</Button>
                <Button className="w-[130px]" variant={"destructive"} onClick={() => setExportOpen(true)}>
                    <Upload></Upload>
                    ส่งออกสินค้า
                </Button>
            </div>
            <DataTable columns={columns as any} data={data} isActions={true} onUpdate={() => {
                SetIsUpdate(!isUpdate)
            }} user={session.user.username} role={session.user.role} />
        </div>
    );
}
