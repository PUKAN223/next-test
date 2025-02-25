'use client'

import { SettingProps } from "@/props/Settings";
import { BellIcon, CircleAlert, ThermometerIcon } from "lucide-react";
import ConfigsAdmin from "./SideNavbars";

const Settings: { [key: string]: SettingProps[] } = {
    admin: [
        {
            icon: ThermometerIcon,
            name: "ธีม",
            type: "toggle",
            descriptionn: 'เลือกธีม "สว่าง" หรือ "มืด" หน้าเว็บของคุณ',
            state: (theme, nofication) => theme == "dark",
            onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
                if (toggle) {
                    setTheme("dark");
                } else {
                    setTheme("light");
                }
            },
            onKeyChange: (key: string) => {
            },
            key: () => { return "theme" }
        },
        {
            icon: CircleAlert,
            name: "การเเจ้งเตือนสินค้า",
            type: "toggle",
            descriptionn: 'เปิด/ปิดการเเจ้งเตือนสินค้าใกล้หมด',
            state: (theme, nofication) => (nofication ? (nofication == "true" ? true : false) : false),
            onToggle: (toggle: boolean, setTheme: (theme: string) => void, setNofication: (bool: boolean) => void) => {
                setNofication(toggle)
                window.localStorage.setItem("nofications", `${toggle}`)
            },
            onKeyChange: (key: string) => {
            },
            key: () => { return "nofications" }
        },
        {
            icon: BellIcon,
            name: "ตั้งค่าจำนวนสินค้าใกล้หมด",
            type: "input",
            descriptionn: 'ตั้งค่าจำนวนสินค้าใกล้หมดที่ต้องการเเจ้งเตือน',
            onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
            },
            state: (theme, nofication) => false,
            onKeyChange: (key: string) => {
                window.localStorage.setItem("nofiA", key)
            },
            key: () => { return window.localStorage.getItem("nofiA") || "0" }
        }
    ],
    user: [{
        icon: ThermometerIcon,
        name: "ธีม",
        type: "toggle",
        descriptionn: 'เลือกธีม "สว่าง" หรือ "มืด" หน้าเว็บของคุณ',
        state: (theme, nofication) => theme == "dark",
        onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
            if (toggle) {
                setTheme("dark");
            } else {
                setTheme("light");
            }
        },
        onKeyChange: (key: string) => {
        },
        key: () => { return "theme" }
    },
    {
        icon: CircleAlert,
        name: "การเเจ้งเตือนสินค้า",
        type: "toggle",
        descriptionn: 'เปิด/ปิดการเเจ้งเตือนสินค้าใกล้หมด',
        state: (theme, nofication) => (nofication ? (nofication == "true" ? true : false) : false),
        onToggle: (toggle: boolean, setTheme: (theme: string) => void, setNofication: (bool: boolean) => void) => {
            setNofication(toggle)
            window.localStorage.setItem("nofications", `${toggle}`)
        },
        onKeyChange: (key: string) => {
        },
        key: () => { return "nofications" }
    },
    {
        icon: BellIcon,
        name: "ตั้งค่าจำนวนสินค้าใกล้หมด",
        type: "input",
        descriptionn: 'ตั้งค่าจำนวนสินค้าใกล้หมดที่ต้องการเเจ้งเตือน',
        onToggle: (toggle: boolean, setTheme: (theme: string) => void) => {
        },
        state: (theme, nofication) => false,
        onKeyChange: (key: string) => {
            window.localStorage.setItem("nofiA", key)
        },
        key: () => { return window.localStorage.getItem("nofiA") || "0" }
    }
    ]
};

export default Settings;
