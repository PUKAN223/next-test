import Link from "@/props/SideNavbar"
import { BellRing, ChartLine, Container, History, Home, Settings, ShoppingCart, User } from "lucide-react";

const ConfigSidebar: { [key: string]: Link[] } = {
    admin: [
        {
            title: "หน้าหลัก",
            href: "/pages/dashboards/admin",
            icon: Home,
            variant: "ghost",
            id: "dashboard"
        },
        {
            title: "สินค้า",
            href: "/pages/containers/admin",
            icon: Container,
            variant: "ghost",
            id: "containers"
        },
        {
            title: "พนักงาน",
            href: "/pages/employees/admin",
            icon: User,
            variant: "ghost",
            id: "employee"
        },
        {
            title: "รายงาน",
            href: "/pages/reports/admin",
            icon: ChartLine,
            variant: "ghost",
            id: "employee"
        },
        {
            title: "เเจ้งเตือน",
            href: "/pages/nofications/admin",
            icon: BellRing,
            variant: "ghost",
            id: "nofications"
        },
        {
            title: "ตั้งค่า",
            href: "/pages/settings/admin",
            icon: Settings,
            variant: "ghost",
            id: "settings"
        }
    ],
    user: [
        {
            title: "หน้าหลัก",
            href: "/pages/dashboards",
            icon: Container,
            variant: "ghost",
            id: "containers"
        },
        {
            title: "เเจ้งเตือน",
            href: "/pages/nofications",
            icon: BellRing,
            variant: "ghost",
            id: "nofications"
        },
        {
            title: "ตั้งค่า",
            href: "/pages/settings",
            icon: Settings,
            variant: "ghost",
            id: "settings"
        }
    ]
}

export default ConfigSidebar;