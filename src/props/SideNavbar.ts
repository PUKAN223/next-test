import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface NavbarLinks {
    title: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    id: string
    label?: string;
}

export default NavbarLinks;