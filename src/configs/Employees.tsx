import Container from "@/props/Containers";
import Employees from "@/props/Employees";
import { ColumnDef } from "@tanstack/react-table";

export const EmployeeData: ColumnDef<Employees>[] = [
    {
        accessorKey: "name",
        header: "ชื่อ",
        cell: ({ row }) => (
            <div className="flex gap-2 items-center" >
                <img className="h-10 w-10" src={row.original.profile.image} alt="product-image" />
                <p>{row.original.profile.name}</p>
            </div>
        )
    },
    {
        accessorKey: "username",
        header: "ผู้ใช้",
    },
    {
        accessorKey: "password",
        header: "รหัสผ่าน",
    },
    {
        accessorKey: "age",
        header: "อายุ"
    },
    {
        accessorKey: "gender",
        header: "เพศ"
    }
]