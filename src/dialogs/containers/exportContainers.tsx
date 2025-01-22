'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toast } from "@/components/ui/toast";
import { editContainers } from "@/functions/stock/edit";
import { toast } from "@/hooks/use-toast";
import Container from "@/props/Containers";
import Histories from "@/props/Histories";
import Stocks from "@/props/Stocks";
import { useState } from "react";
import { number } from "zod";

type Props = {
    exportOpen: boolean;
    onExportOpen: (t: boolean) => void;
    data: Container[] & { _id: string },
    username: string,
    role: string
}

export default function DialogExportContainers({ exportOpen, onExportOpen, data, username, role }: Props) {
    const [exportProduct, setExportProduct] = useState<{ [id: string]: number }>({});
    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>, containers: Container & { _id: string }) {
        const allQuantity = containers.stock.map((stock) => stock.amount).reduce((a, b) => a + b, 0);
        if (parseInt(e.target.value) > allQuantity) {
            e.target.value = allQuantity.toString();
        }
        if (parseInt(e.target.value) < 0) {
            e.target.value = "0";
        }
        if (parseInt(e.target.value) > 0) {
            setExportProduct({
                ...exportProduct,
                [containers._id]: parseInt(e.target.value)
            })
        }
    }

    function handleExportSubmit() {
        let costprice: { [id: string]: number } = {};
        let sellprice: { [id: string]: number } = {};

        Object.keys(exportProduct).forEach((key) => {
            let quantity = exportProduct[key];
            let q = exportProduct[key];
            let container = data.find((container) => (container as Container & { _id: string })._id === key) as Container & { _id: string };

            if (!container) return;

            if (!costprice[container._id]) costprice[container._id] = 0;
            if (!sellprice[container._id]) sellprice[container._id] = 0;

            container.stock = container.stock.map((stock) => {
                if (quantity > 0) {
                    if (stock.amount >= quantity) {
                        costprice[container._id] += stock.costPrice * quantity;
                        sellprice[container._id] += stock.sellPrice * quantity;
                        stock.amount -= quantity;
                        quantity = 0;
                    } else {
                        costprice[container._id] += stock.costPrice * stock.amount;
                        sellprice[container._id] += stock.sellPrice * stock.amount;
                        quantity -= stock.amount;
                        stock.amount = 0;
                    }
                }
                return stock;
            });
            const oldData = structuredClone(container)
            container.stock = container.stock.filter((stock) => stock.amount > 0);
            const d1 = container._id
            delete container["_id"]
            fetch(`${process.env.API_URL}/api/stock/containers/edit/${d1}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(container),
            }).then(res => {
                oldData.stock[0].amount = q
                fetch(`${process.env.API_URL}/api/stock/histories/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: { ...container, stock: [oldData.stock[0]] as Stocks[] }, action: "export", timeStamp: new Date().toLocaleDateString(), createBy: username + ` (${role})` } as Histories),
                }).then(res => res.json())
                    .then(res => {
                        toast({
                            description: "ส่งออกสินค้าสำเร็จ",
                        });
                        onExportOpen(false);
                    })
            })
        });
    }


    return (
        <Dialog open={exportOpen} onOpenChange={(o) => onExportOpen(o)}>
            <DialogContent style={{
                maxWidth: '1000px',
                width: '100%',
                overflowY: 'auto',
                padding: '1rem',
                maxHeight: '500px',
            }}>
                <DialogHeader>
                    <DialogTitle>ส่งออกสินค้า</DialogTitle>
                    <DialogDescription>
                        สามารถส่งออกสินค้าได้ที่นี่
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ maxWidth: "1000px", width: "30%" }}>ชื่อ</TableHead>
                                <TableHead style={{ maxWidth: "1000px", width: "30%" }}>หมวดหมู่</TableHead>
                                <TableHead style={{ maxWidth: "1000px", width: "30%" }}>หมายเหตุ</TableHead>
                                <TableHead style={{ maxWidth: "1000px", width: "20%", justifyContent: "center" }}>จำนวน</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length ? (
                                data.map((container, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{container.name}</TableCell>
                                        <TableCell>{container.category}</TableCell>
                                        <TableCell>{container.description}</TableCell>
                                        <TableCell className="flex justify-end" style={{ position: "relative" }}>
                                            <Input
                                                defaultValue={0}
                                                type="number"
                                                className="w-20 h-8 p-2 text-center border rounded-md"
                                                onChange={(e) => handleQuantityChange(e, container as Container & { _id: string })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500">
                                        No results
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex justify-center mt-4">
                        <Button style={{ width: "100%" }} variant={"destructive"} onClick={handleExportSubmit}>ส่งออก</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}