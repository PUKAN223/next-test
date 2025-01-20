import React, { useEffect } from "react"

export interface UseDialogDataProps<T> {
    data: T;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export type UseDialogDataReturn<T> = [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    T | null,
    (open: boolean, data?: T) => void
]

export function useDialogData<T>(): UseDialogDataReturn<T> {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState<T | null>(null);

    useEffect(() => {
        if (!open) setData(null);
    }, [open])

    const setDataOpen = React.useCallback((open: boolean, data?: T) => {
        setTimeout(() => {
            setData(data ? data : null);
            setOpen(open);
        }, 100);
    }, [data])

    return [
        open,
        setOpen,
        data,
        setDataOpen
    ]
}