import { CardProps } from "@/props/Card"
import { ChartColumnIncreasing, ChartColumnDecreasing, ChartNoAxesCombined, PackageSearch, ArchiveRestore, Import, Truck } from 'lucide-react';
import NavbarLinks from "@/configs/SideNavbars"

type NavbarKeys = typeof NavbarLinks[number]["id"];

const cardData: Record<NavbarKeys, CardProps[]> = {
    dashboard: [
        {
            label: "รายรับ",
            icon: ChartColumnIncreasing,
            discription: "รายรับทั้งหมดในเดือนนี้",
            amount: "{1}฿",
        },
        {
            label: "รายจ่าย",
            icon: ChartColumnDecreasing,
            discription: "รายจ่ายทั้งหมดในเดือนนี้",
            amount: "{1}฿",
        },
        {
            label: "กำไร",
            icon: ChartNoAxesCombined,
            discription: "กำไรทั้งหมดในเดือนนี้",
            amount: "{1}฿",
        }
    ],
    containers: [
        {
            label: "คลังสินค้าทั้งหมด",
            icon: Import,
            discription: "คลังสินค้าทั้งหมดในตอนนี้",
            amount: "{1} รายการ"
        },
        {
            label: "สินค้าทั้งหมด",
            icon: PackageSearch,
            discription: "สินค้าทั้งหมดในตอนนี้",
            amount: "{1} รายการ"
        },
        {
            label: "สินค้าส่งออก",
            icon: ArchiveRestore,
            discription: "สินค้าส่งออกทั้งหมดในเดือนนี้",
            amount: "{1} รายการ"
        },
        {
            label: "สินค้านำเข้า",
            icon: Import,
            discription: "สินค้านำเข้าทั้งหมดในเดือนนี้",
            amount: "{1} รายการ"
        }
    ],
    histories: [

    ],
    orders: [

    ]
}

export default cardData;