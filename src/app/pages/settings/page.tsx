"use client"

import Card, { CardContent } from '@/components/Card'
import PageTitle from '@/components/PageTitle'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import Settings from '@/configs/SettingConfig'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

function Page() {
  const { theme, setTheme } = useTheme();
  const [isUpdate, setIsUpdate] = useState(true)
  const [nofication, setNofication] = useState(true)

  useEffect(() => {
    setNofication(window.localStorage.getItem("nofications") == "true" ? true : false)
  }, [isUpdate])

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="การตั้งค่า" />
      <div className='flex w-full justify-between'>
        <CardContent className='w-full'>
          {Settings["user"].map((x, i) => (
            <>
              {(x.type == "toggle" ? (
                (i !== Settings["user"].length - 1) ? (
                  <div key={i} className='flex-col gap-1 space-y-2'>
                    {(i !== 0 ? (
                      <div className='h-1'></div>
                    ) : (
                      <></>
                    ))}
                    <div className='flex space-x-1 justify-between'>
                      <div className='flex space-x-1'>
                        <x.icon />
                        <p className='font-bold'>{x.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={x.name}
                          onCheckedChange={(toggle) => x.onToggle(toggle, setTheme, setNofication)}
                          checked={x.state(theme, `${nofication}`)}
                        />
                      </div>
                    </div>
                    <p className='text-sm'>{x.descriptionn}</p>
                    <Separator className="translate-y-2" orientation="horizontal" />
                  </div>
                ) : (
                  <div key={i} className='flex-col gap-1 space-y-2'>
                    <div className='h-1'></div>
                    <div className='flex justify-between'>
                      <div className='flex space-x-1'>
                        <x.icon />
                        <p className='font-bold'>{x.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={x.name}
                          onCheckedChange={(toggle) => x.onToggle(toggle, setTheme, setNofication)}
                          checked={x.state(theme, `${nofication}`)}
                        />
                      </div>
                    </div>
                    <p className='text-sm'>{x.descriptionn}</p>
                  </div>
                )
              ) : (
                <></>
              ))}
              {(x.type == "input" ? (
                (i !== Settings["user"].length - 1 ? (
                  <div key={i} className='flex-col gap-1 space-y-2'>
                    <div className='h-1'></div>
                    <div className="flex justify-between">
                      <div className='flex space-x-1'>
                        <x.icon />
                        <p className='font-bold'>{x.name}</p>
                      </div>
                      <div>
                        <input className='w-40 h-7 p-2 border rounded-md text-center' value={x.key()} onChange={(e) => x.onKeyChange(e.target.value)} />
                      </div>
                    </div>
                    <p className='text-sm'>{x.descriptionn}</p>
                    <Separator className="translate-y-2" orientation="horizontal" />
                  </div>
                ) : (
                  <div key={i} className='flex-col gap-1 space-y-2'>
                    <div className='h-1'></div>
                    <div className="flex justify-between">
                      <div className='flex space-x-1'>
                        <x.icon />
                        <p className='font-bold'>{x.name}</p>
                      </div>
                      <div>
                        <input className='w-40 h-7 p-2 border rounded-md text-center' defaultValue={x.key()} onChange={(e) => x.onKeyChange(e.target.value)}/>
                      </div>
                    </div>
                    <p className='text-sm'>{x.descriptionn}</p>
                  </div>
                ))
              ) : (
                <></>
              ))}
            </>
          ))}
        </CardContent>
      </div>
    </div>
  )
}

export default Page;
