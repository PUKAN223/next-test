'use client'

import PageTitle from '@/components/PageTitle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Container from '@/props/Containers'
import { BellRing, Terminal, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function NoficationPage() {
    const [nofication, setNofication] = useState<{ item: Container }[]>([])
    const [exportAmount, setExportAmount] = useState<number>(0)

    useEffect(() => {
        fetch("/api/stock/containers/get")
            .then(res => res.json())
            .then((data: Container[]) => {
                setNofication([])
                data.forEach((d) => {
                    const amount = d.stock.reduce((a, b) => a + b.amount, 0)
                    if (amount <= 12) {
                        setNofication((g) => [...g, { item: d }])
                    }
                })
            })
    }, [])

    return (
        <div>
            <div className="flex flex-col gap-5 w-full">
                <PageTitle title="เเจ้งเตือน"></PageTitle>
                <div className='flex w-full justify-between'>
                    <p className='flex text-sm text-gray-500'>คุณสามารถรับเเจ้งเตือนได้ที่นี่.</p>
                </div>
                <div>
                    {(nofication.map(x => (
                        <>
                            <Alert variant={"destructive"}>
                                <BellRing className="h-4 w-4 translate-y-[1px]" />
                                <AlertTitle>{x.item.name + ` ${x.item.description}`}</AlertTitle>
                                <AlertDescription>
                                    {"สินค้าของคุณเหลือน้อยกรุณาเติมสินค้า!"}
                                </AlertDescription>
                            </Alert>
                            <div className='w-full h-2'></div>
                        </>
                    )))}
                </div>
            </div>
        </div>
    )
}

export default NoficationPage