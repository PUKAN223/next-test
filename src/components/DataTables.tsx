"use client";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Ellipsis, EllipsisVertical, Filter, Trash } from 'lucide-react'

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogData } from "@/hooks/use-dialog";
import { ContainerSchema } from "@/schemas/Containers";
import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import handleSubmitEdit from "@/app/pages/containers/admin/handles/forms/EditSubmit";
import Container from "@/props/Containers";
import handleSubmitDelete from "@/app/pages/containers/admin/handles/forms/DeleteSubmit";
import DialogDeleteContainers from "@/dialogs/containers/deleteContainers";
import DialogEditContainers from "@/dialogs/containers/editContainers";
import DialogManageContainers from "@/dialogs/containers/manageContainers";
import { getContainers } from "@/functions/stock/get";
import React from "react";
import DialogExportContainers from "@/dialogs/containers/exportContainers";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isActions: boolean;
    onUpdate: () => void;
    user: string,
    role: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isActions,
    onUpdate,
    user,
    role
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFilter, setSearchFilter] = useState<"name" | "category">("name"); // Dropdown filter choice
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filter data based on search filter (name or category)
    const filteredData = useMemo(() => {
        return data.filter((item: any) =>
            item[searchFilter]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [data, debouncedSearchTerm, searchFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });
    const [editOpen, setEditOpen, editData, setEditData] = useDialogData()
    const [deleteOpen, setDeleteOpen, deleteData, setDeleteData] = useDialogData()
    const [manageOpen, setManageOpen, manageData, setManageData] = useDialogData()

    useEffect(() => {
        onUpdate()
    }, [deleteOpen, editOpen])

    return (
        <>
            <div className="mb-5 flex items-center space-x-2 relative top-[20px]">
                <Input
                    placeholder={`Search by ${searchFilter}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm flex-1"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="max-w-xs">
                            <Filter></Filter>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-0">
                        <DropdownMenuItem onClick={() => setSearchFilter("name")}>Name</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchFilter("category")}>Category</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <DialogManageContainers manageOpen={manageOpen} onSetManageOpen={(t) => setManageData(t)} data={manageData as any} onUpdate={onUpdate} user={user} role={role} />
                <DialogEditContainers editOpen={editOpen} onSetEditOpen={(t) => setEditOpen(t)} editData={editData} schema={ContainerSchema} user={user} role={role} />
                <DialogDeleteContainers deleteOpen={{ open: deleteOpen, data: deleteData }} onSetDeleteOpen={(t) => setDeleteOpen(t)} user={user} role={role} />

                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead style={{ maxWidth: "1000px", width: "30%" }} key={column.id}>{column.header as any}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredData.length ? (
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <React.Fragment key={column.id}>
                                            {(column as any).accessorKey === "name" ? (
                                                <TableCell className="text-black-500">
                                                    <div className="flex gap-2 items-center">
                                                        <img className="h-10 w-10 rounded-[5px]" src={(row as any).logo} alt="product-image" />
                                                        <span>{(column as any).accessorKey ? (row as any)[(column as any).accessorKey] : null}</span>
                                                    </div>
                                                </TableCell>
                                            ) : (
                                                <>
                                                    {(column as any).accessorKey == "quantity" ? (
                                                        <TableCell className="text-black-500">
                                                            {(row as { stock: any[] }).stock.reduce((a, b) => a + b.amount, 0)}
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell className="text-black-500">
                                                            {(column as any).accessorKey ? (row as any)[(column as any).accessorKey] : null}
                                                        </TableCell>
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {isActions && (
                                        <TableCell>
                                            <div className="flex justify-end space-x-2 items-center" style={{ position: "relative"}}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"destructive"}><Ellipsis /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                console.log(row)
                                                                setEditData(true, row);
                                                            }}
                                                            className="text-blue-500"
                                                        >
                                                            <Edit /> เเก้ไข
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setDeleteData(true, row);
                                                            }}
                                                            className="text-red-500"
                                                        >
                                                            <Trash /> ลบ
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <Button
                                                    onClick={() => {
                                                        getContainers((row as any)._id).then(res => {
                                                            setManageData(true, res[0])
                                                        })
                                                    }}
                                                    id={(row as any).id as string}
                                                >
                                                    ดูสินค้า
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>
    );
}
