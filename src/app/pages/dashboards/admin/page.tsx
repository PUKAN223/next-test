"use client"

import Card from "@/components/Card";
import PageTitle from "@/components/PageTitle";
import CardData from "@/configs/CardDatas"
import { CardContent } from "@/components/Card";
import BarChart from "@/components/BarChart";
import RecentSales from "@/configs/RecentSalesDatas"
import SalesCard from "@/components/RecentSales";
import { replaceData } from "@/functions/replace-data";
import { useEffect, useState } from "react";
import Container from "@/props/Containers";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Histories from "@/props/Histories";
import { SalesProps } from "@/props/RecentSales";

export default function Dashboard() {
    const { data: session, status } = useSession()
    const [amountData, setAmountData] = useState<string[]>(["0", "0", "0"])
    const [exportAmount, setExportAmount] = useState<number>(0)
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [sData, setSData] = useState<SalesProps[]>([])
    useEffect(() => {
        if (!session) redirect("/pages/dashboards")
        if (session.user.role == "user") redirect("/pages/dashboards");

        const fetchData = async () => {
            const response1 = await fetch(`/api/stock/histories/get`)
            const histories = (await response1.json() as { data: Histories[] }).data
            const month = new Date().toLocaleDateString().split("/")[0]
            const exportSell = histories.filter(x => x.action == "export").filter(x => x.timeStamp.split("/")[0] == month).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].sellPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            const importCost = histories.filter(x => x.action == "import").filter(x => x.timeStamp.split("/")[0] == month).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].costPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            const deleteSell = histories.filter(x => x.action == "delete").filter(x => x.data.stock.length > 0).filter(x => x.timeStamp.split("/")[0] == month).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].costPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
            setExpense(importCost - deleteSell)
            setIncome(exportSell)

            const hData: SalesProps[] = []
            setExportAmount(0)
            histories.filter(x => x.action == "export").filter(x => x.timeStamp.split("/")[0] == month).filter(x => x.data.stock.length == 1).reverse().forEach((data, i) => {
                if (i < 6) {
                    hData.push({ name: data.data.name, logo: data.data.logo, saleAmount: `${data.data.stock[0].amount}x`, description: data.data.description })
                }
                setExportAmount((am) => am + data.data.stock[0].amount)
            })
            setSData(hData)
        }
        fetchData()
    }, [])

    useEffect(() => {
        setAmountData([`${income}`, `${expense}`, `${income - expense}`])
    }, [income, expense])

    if (session && status == "authenticated") {
        return (
            <div className="flex flex-col gap-5  w-full">
                <PageTitle title="หน้าหลัก"></PageTitle>
                <section className={`grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3`}>
                    {CardData["dashboard"].map((item, i) => (
                        <Card
                            key={i}
                            amount={replaceData(item.amount, [amountData[i]])}
                            discription={item.discription}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </section>
                <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
                    <CardContent>
                        <h1 style={{ "fontSize": 20, textAlign: "center" }} className="p-5 font">ภาพรวม</h1>
                        <BarChart />
                    </CardContent>
                    <CardContent className="flex justify-start gap-4">
                        <section>
                            <p>รายการส่งออกเมื่อเร็วๆนี้</p>
                            <p className="text-sm text-gray-400">
                                คุณส่งออกสินค้า {`${exportAmount}`} รายการในเดือนนี้
                            </p>
                        </section>
                        {sData.map((d, i) => (
                            <SalesCard
                                key={i}
                                logo={d.logo}
                                name={d.name}
                                saleAmount={d.saleAmount}
                                description={d.description}
                            />
                        ))}
                    </CardContent>
                </section>
            </div>
        );
    } else {
        redirect("/login/admin")
    }
}
