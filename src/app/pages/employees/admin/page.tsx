'use client'

import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { UserPlus } from 'lucide-react';

import React, { useEffect, useState } from 'react'
import EmployeeTable from '@/components/EmployeeTable';
import Employees from '@/props/Employees';
import { ColumnDefBase } from '@tanstack/react-table';
import { EmployeeData } from "@/configs/Employees"
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useDialogData } from '@/hooks/use-dialog';
import DialogAddEmployees from '@/dialogs/employees/addEmployee';
import { EmployeeSchema } from '@/schemas/Employees';

function EmployeePage() {
  const [employee, setEmployee] = useState<Employees[]>([])
  const [columns, setColumns] = useState<ColumnDefBase<Employees>[]>([])
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [addOpen, setAddOpen, addData, setAddData] = useDialogData()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!session) redirect("/pages/dashboards")
    if (session.user.role == "user") redirect("/pages/dashboards")

    const fetchData = async () => {
      const response = await fetch(`/api/employees/get`)
      const employeeData: Employees[] = await response.json()
      setEmployee(employeeData)
    }
    fetchData()
    setColumns(EmployeeData)
  }, [isUpdate])

  return (
    <div>
      <div className="flex flex-col gap-5 w-full">
        <DialogAddEmployees addOpen={addOpen} onSetAddOpen={(t) => setAddOpen(t)} schema={EmployeeSchema} user={session.user.username} role={session.user.role}></DialogAddEmployees>
        <PageTitle title="จัดการพนักงาน"></PageTitle>
        <p className='flex text-sm text-gray-500'>คุณสามารถจัดการพนักงานได้ที่นี่.</p>
        <Button className="w-[135px]" onClick={() => setAddOpen(true)}>
          <UserPlus />
          เพิ่มพนักงาน
        </Button>
        <EmployeeTable columns={columns as any} data={employee} isActions={true} onUpdate={() => setIsUpdate(!isUpdate)} user={session.user.username} role={session.user.role} />
      </div>
    </div>
  )
}

export default EmployeePage