'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import handleSubmitAdd from "@/app/pages/containers/admin/handles/forms/AddSubmit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDate } from "date-fns";
import { EllipsisVertical, Trash } from "lucide-react";
import DialogAddProducts from "./addProduct";
import Stocks from "@/props/Stocks";
import { getContainers } from "@/functions/stock/get";
import { editContainers } from "@/functions/stock/edit";
import Container from "@/props/Containers";
import { toast } from "sonner";
import Histories from "@/props/Histories";

type Props = {
    manageOpen: boolean;
    onSetManageOpen: (t: boolean) => void;
    data: {
        _id: string;
        stock: Stocks[];
    };
    onUpdate: () => void,
    user: string,
    role: string
};

const stockSchema = z.object({
    expiryDate: z.string().min(1, "Expiry date is required"),
    costPrice: z.number().min(1, "Cost price must be positive"),
    sellPrice: z.number().min(1, "Sell price must be positive"),
});

export default function DialogManageContainers({ manageOpen, onSetManageOpen, data, onUpdate, user, role }: Props) {
    const [localData, setLocalData] = useState(data);
    useEffect(() => {
        setLocalData(data);
    }, [data])
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const handleAddProduct = (newProduct: any) => {
        setLocalData(newProduct);
        onUpdate()
    };

    return (
        <div>
            <DialogAddProducts
                addOpen={isAddingProduct}
                onSetAddOpen={(t) => setIsAddingProduct(t)}
                schema={stockSchema}
                data={data} // Pass the local data to the child component
                onAddProduct={handleAddProduct} // Pass the handler to update the data,
                username={user}
                role={role}
            />
            <Dialog open={manageOpen} onOpenChange={(o) => onSetManageOpen(o)}>
                <DialogContent style={{
                    maxWidth: '800px',
                    width: '100%',
                    overflowY: 'auto',
                    padding: '1rem',
                    maxHeight: '500px',
                }}>
                    <DialogHeader>
                        <DialogTitle><br></br><br></br>จัดการสินค้า</DialogTitle>
                        <DialogDescription>
                            สามารถเพิ่มสินค้าได้ที่นี่
                        </DialogDescription>
                    </DialogHeader>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', position: "relative", top: "-60px", right: "0px" }}>
                        <Button style={{ width: 100 }} onClick={() => {
                            setIsAddingProduct(true);
                        }}>เพิ่มสินค้า</Button>
                    </div>

                    <div className="mt-4" style={{ position: "relative", top: "-60px", right: "0px" }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ลำดับ</TableHead>
                                    <TableHead>จำนวน</TableHead>
                                    <TableHead>วันหมดอายุ</TableHead>
                                    <TableHead>วันที่ลงสินค้า</TableHead>
                                    <TableHead>ราคาทุน</TableHead>
                                    <TableHead>ราคาขาย</TableHead>
                                    <TableHead> </TableHead> {/* Add an extra column for actions */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(localData?.stock?.length ? (
                                    localData.stock.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>#{index + 1}</TableCell>
                                            <TableCell>{item.amount}x</TableCell>
                                            <TableCell>{format(new Date(item.expiryDate), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{format(new Date(item.createAt), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{item.costPrice.toFixed(2)}฿</TableCell>
                                            <TableCell>{item.sellPrice.toFixed(2)}฿</TableCell>
                                            <TableCell style={{ position: "relative" }}>
                                                <Button variant="outline" className="w-8 h-8 p-0 flex items-center justify-center" onClick={() => {
                                                    getContainers(data._id).then((res) => {
                                                        const newData = res[0] as unknown as Container & { _id: string };
                                                        const deleted = newData.stock[index]
                                                        newData.stock.splice(index, 1)
                                                        delete newData["_id"]
                                                        fetch(`${process.env.API_URL}/api/stock/containers/edit/${data._id}`, {
                                                            method: "PUT",
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify(newData),
                                                        })
                                                            .then(res => res.json())
                                                            .then(res => {
                                                                fetch(`${process.env.API_URL}/api/stock/histories/add`, {
                                                                    method: "POST",
                                                                    headers: {
                                                                        "Content-Type": "application/json"
                                                                    },
                                                                body: JSON.stringify({ data: { ...newData, stock: [deleted] }, action: "delete", timeStamp: new Date().toLocaleDateString(), createBy: user + ` (${role})` } as unknown as Histories),
                                                                }).then(res => res.json())
                                                                    .then(res => {
                                                                        toast("ลบสินค้าสำเร็จ")
                                                                        handleAddProduct(newData)
                                                                        onUpdate()
                                                                    })
                                                            })
                                                    })
                                                }}>
                                                    <Trash className="text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            No results
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function getFormattedDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = String(now.getFullYear()).slice(2); // Get last two digits of the year

    return `${day}-${month}-${year}`;
}
