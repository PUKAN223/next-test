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
import DialogEditEmployees from "@/dialogs/employees/editEmployee";
import { EmployeeSchema } from "@/schemas/Employees";
import DialogDeleteEmployees from "@/dialogs/employees/deleteEmployee";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import Employees from "@/props/Employees";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isActions: boolean;
    onUpdate: () => void;
    user: string,
    role: string
}

export default function EmployeeTable<TData, TValue>({
    columns,
    data,
    isActions,
    onUpdate,
    user,
    role
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFilter, setSearchFilter] = useState<"name" | "gender">("name"); // Dropdown filter choice
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filter data based on search filter (name or category)
    const filteredData = useMemo(() => {
        return data.filter((item: any) =>
            item["profile"][searchFilter]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [data, debouncedSearchTerm, searchFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });
    const [currIndex, setCurrIndex] = useState(0)
    const { pageIndex, pageSize } = table.getState().pagination;
    const { setPageIndex, setPageSize, getCanPreviousPage: canPreviousPage, getCanNextPage: canNextPage, getPageCount: pageCount } = table;
    const [editOpen, setEditOpen, editData, setEditData] = useDialogData()
    const [deleteOpen, setDeleteOpen, deleteData, setDeleteData] = useDialogData()
    const [manageOpen, setManageOpen, manageData, setManageData] = useDialogData()

    useEffect(() => {
        console.log(currIndex)
        setPageIndex(currIndex)
    }, [pageIndex])

    useEffect(() => {
        setPageSize(5)
        if (deleteOpen == false && editOpen == false) {
            setCurrIndex(pageIndex)
            onUpdate()
        }
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
                        <DropdownMenuItem onClick={() => setSearchFilter("name")}>ชื่อ</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchFilter("gender")}>เพศ</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <DialogEditEmployees editOpen={editOpen} onSetEditOpen={(t) => setEditOpen(t)} editData={editData as any} schema={EmployeeSchema} user={user} role={role} onUpdate={onUpdate} />
                <DialogDeleteEmployees deleteOpen={{ open: deleteOpen, data: deleteData as any }} onSetDeleteOpen={(t) => setDeleteOpen(t)} user={user} role={role} onUpdate={onUpdate}></DialogDeleteEmployees>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead style={{ maxWidth: "1000px", width: "27.5%" }} key={column.id}>{column.header as any}</TableHead>
                            ))}
                            <TableHead style={{ maxWidth: "1000px", width: "27.5%" }}></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <React.Fragment key={column.id}>
                                            {(column as any).accessorKey === "name" ? (
                                                <TableCell className="text-black-500">
                                                    <div className="flex gap-2 items-center">
                                                        <img className="h-10 w-10 rounded-[5px]" src={(row.original as Employees).profile.image} alt="profile-image" />
                                                        <span className="translate-y-0.5">{(row.original as Employees).profile.name}</span>
                                                    </div>
                                                </TableCell>
                                            ) : (
                                                <>
                                                    {((column as any).accessorKey == "username" || (column as any).accessorKey == "password") ? (
                                                        <TableCell className="text-black-500">
                                                            {(column as any).accessorKey ? (row.original as Employees)[(column as any).accessorKey as "username"] : null}
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell className="text-black-500">
                                                            {(column as any).accessorKey ? (row.original as Employees)["profile"][(column as any).accessorKey as "image"] : null}
                                                        </TableCell>
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {isActions && (
                                        <TableCell>
                                            <div className="flex justify-end space-x-2 items-center" style={{ position: "relative" }}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"outline"}><Ellipsis /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                console.log(row.original)
                                                                setEditData(true, row.original);
                                                            }}
                                                            className="text-blue-500"
                                                        >
                                                            <Edit /> เเก้ไข
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setDeleteData(true, row.original);
                                                            }}
                                                            className="text-red-500"
                                                        >
                                                            <Trash /> ลบ
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                {data.length > 0 ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        if (canPreviousPage()) {
                                            e.preventDefault();
                                            setCurrIndex(pageIndex - 1)
                                            setPageIndex(pageIndex - 1);  // Go to previous page
                                        } else e.preventDefault();
                                    }}
                                />
                            </PaginationItem>

                            {/* Page Number Logic */}
                            {(() => {
                                const start = Math.max(0, pageIndex - 2); // Start the page range 2 pages before the current page
                                const end = Math.min(pageCount(), start + 5); // Limit the page range to 5 pages

                                const pages = [];
                                for (let i = start; i < end; i++) {
                                    pages.push(i);
                                }

                                return pages.map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrIndex(page)
                                                setPageIndex(page);  // Set page to the clicked page
                                            }}
                                            className={pageIndex === page ? "bg-black" : ""}
                                            isActive={pageIndex === page}
                                        >
                                            <p className={pageIndex === page ? "text-white" : ""}>
                                                {page + 1}
                                            </p>
                                        </PaginationLink>
                                    </PaginationItem>
                                ));
                            })()}

                            {/* Next Button */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        if (canNextPage()) {
                                            setCurrIndex(pageIndex + 1)
                                            e.preventDefault();
                                            setPageIndex(pageIndex + 1);  // Go to next page
                                        } else e.preventDefault();
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
