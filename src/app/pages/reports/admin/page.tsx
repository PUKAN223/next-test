'use client'

import { CardContent } from '@/components/Card'
import PageTitle from '@/components/PageTitle'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import Employees from '@/props/Employees'
import Histories from '@/props/Histories'
import { Delete, Download, Edit, Import, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function ReportHome() {
  const [history, setHistory] = useState<Histories[]>([])
  const [userData, setUserData] = useState<Map<string, Employees>>(new Map<string, Employees>())

  useEffect(() => {
    fetch("/api/stock/histories/get")
      .then(res => res.json())
      .then((data: { data: Histories[] }) => {
        setHistory(data.data.reverse())
      })
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const updatedUserData = new Map(userData);

      for (const d of history) {
        const userId = d.createBy.split(" ")[0];
        if (!updatedUserData.has(userId)) {
          const user = await getDataFromUser(userId);
          updatedUserData.set(userId, user || null);
        }
      }

      setUserData(updatedUserData);
    };

    if (history.length) {
      fetchUserData();
    }
  }, [history]);

  return (
    <div>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="รายงาน"></PageTitle>
        <p className='flex text-sm text-gray-500'>คุณสามารถดูรายงานประวัติได้ที่นี่.</p>
        {userData.size > 0 ? (
          <div className='space-y-5'>
            {history.map(x => (
              <CardContent key={(x as any)._id} className='h-28'>
                <div className='flex w-full justify-between'>
                  <div className='w-full flex'>
                    {getBadge(x.action, x)}
                    <p className='translate-y-1 translate-x-1 text-sm text-gray-700'>
                      {getAmount(x)}
                    </p>
                  </div>
                  <div className='justify-end gap-2 relative text-gray-700 text-sm flex w-full'>
                    <img height={"32px"} width={"32px"} style={{ borderRadius: "50%" }}
                      src={userData.get(x.createBy.split(" ")[0])?.profile?.image || "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg"}
                      alt="profile-img" />
                    <p className='text-center justify-center translate-y-1.5 text-gray-500'>
                      {userData.get(x.createBy.split(" ")[0])?.profile?.name || "admin"}
                    </p>
                  </div>
                </div>
                <div>
                  <div className='flex text-gray-700'>
                    <img src={x.data.logo} height={"32px"} width={"32px"} style={{ borderRadius: "15%", marginRight: 7 }} alt="product-logo" />
                    <p className='text-lg'>{x.data.name}</p>
                    <p className='text-xl translate-x-2'>|</p>
                    <p className='text-lg translate-x-4'>{x.data.description}</p>
                  </div>
                  <section className="flex justify-end gap-2">
                    <p className='relative translate-y-[-15px] text-sm text-gray-500'>{x.timeStamp}</p>
                  </section>
                </div>
              </CardContent>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

async function getDataFromUser(name: string) {
  const data = await fetch("/api/employees/get")
  const employees = await data.json() as Employees[]
  return employees.find(x => x.username === name)
}

function getBadge(type: "export" | "import" | "delete" | "edit", data: Histories) {
  if (type == "export") return (
    <Badge style={{ borderRadius: 7 }} variant="outline" className="w-24 h-7 overflow-hidden text-ellipsis bg-yellow-500">
      {getLogo(type)}<p className='translate-x-2 text-white'>{getAction(type)}</p>
    </Badge>
  )
  if (type == "import" && data.data.stock.length > 0) return (
    <Badge style={{ borderRadius: 7 }} variant="outline" className="w-20 h-7 overflow-hidden text-ellipsis bg-green-500">
      {getLogo(type)}<p className='translate-x-2 text-white'>{getAction(type)}</p>
    </Badge>
  )
  if (type == "import") return (
    <Badge style={{ borderRadius: 7 }} variant="outline" className="w-20 h-7 overflow-hidden text-ellipsis bg-purple-500">
      {getLogo(type)}<p className='translate-x-2 text-white'>{"สร้าง"}</p>
    </Badge>
  )
  if (type == "edit") return (
    <Badge style={{ borderRadius: 7 }} variant="outline" className="w-20 h-7 overflow-hidden text-ellipsis bg-blue-500">
      {getLogo(type)}<p className='translate-x-2 text-white'>{getAction(type)}</p>
    </Badge>
  )
  else return (
    <Badge style={{ borderRadius: 7 }} variant="outline" className="w-16 h-7 overflow-hidden bg-red-500 text-ellipsis">
      {getLogo(type)}<p className='translate-x-2 text-white'>{getAction(type)}</p>
    </Badge>
  )
}

function getAction(type: "export" | "import" | "delete" | "edit") {
  if (type == "export") return "ส่งออก"
  if (type == "import") return "นำเข้า"
  if (type == "edit") return "เเก้ไข"
  if (type == "delete") return "ลบ"
}

function getLogo(type: "export" | "import" | "delete" | "edit") {
  if (type == "export") return <Upload className='h-4 w-4 text-white' />
  if (type == "import") return <Import className='h-4 w-4 text-white' />
  if (type == "edit") return <Edit className='h-4 w-4 text-white' />
  if (type == "delete") return <Delete className='h-4 w-4 text-white' />
}

function getAmount(data: Histories) {
  if (data.action == "import" && data.data.stock?.length > 0) return `${data.data.stock[0].amount} รายการ`
  if (data.action == "export" && data.data.stock?.length > 0) return `${data.data.stock[0].amount} รายการ`
  if (data.action == "delete" && data.data.stock?.length > 0) return `${data.data.stock[0].amount} รายการ`
}

export default ReportHome
