import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface SettingProps {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    name: string,
    descriptionn: string,
    onToggle: (toggle: boolean, setTheme: (theme: string) => void) => void,
    state: (theme: string) => boolean
}