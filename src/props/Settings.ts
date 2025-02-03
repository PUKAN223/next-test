import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface SettingProps {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    name: string,
    type: "toggle" | "input" | "slider",
    descriptionn: string,
    onToggle: (toggle: boolean, setTheme: (theme: string) => void, setNofication: (bool: boolean) => void) => void,
    state: (theme: string, nofication: string) => boolean
}