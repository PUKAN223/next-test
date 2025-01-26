'use client'

import { SettingProps } from "@/props/Settings";
import { CircleAlert, ThermometerIcon } from "lucide-react";

const Settings: { [key: string]: SettingProps[] } = {
    admin: [
        {
            icon: ThermometerIcon,
            name: "ธีม",
            descriptionn: 'เลือกธีม "สว่าง" หรือ "มืด" หน้าเว็บของคุณ',
            state: (theme) => theme == "dark",
            onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
                if (toggle) {
                    setTheme("dark");
                } else {
                    setTheme("light");
                }
            }
        },
        {
            icon: CircleAlert,
            name: "การเเจ้งเตือนสินค้า",
            descriptionn: 'เปิด/ปิดการเเจ้งเตือนสินค้าใกล้หมด',
            state: (theme) => true,
            onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
                
            }
        }
    ],
    user: []
};

export default Settings;
