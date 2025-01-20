import Container from "@/props/Containers";
import { ColumnDef } from "@tanstack/react-table";

export const ContainerData: ColumnDef<Container>[] = [
    {
        accessorKey: "name",
        header: "ชื่อ",
        cell: ({ row }) => (
            <div className="flex gap-2 items-center" >
                <img className="h-10 w-10" src={row.original.logo} alt="product-image" />
                <p>{row.getValue("name")} </p>
            </div>
        )
    },
    {
        accessorKey: "category",
        header: "หมวดหมู่",
    },
    {
        accessorKey: "description",
        header: "หมายเหตุ",
    },
    {
        accessorKey: "quantity",
        header: "จำนวน",
        cell: ({ row }) => (
            <div className="flex gap-2 items-center" >
                <p>{row.original.stock.reduce((a, b) => a + b.amount, 0) ?? 0} </p>
            </div>
        )
    }
]