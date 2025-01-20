import Container from "@/props/Containers";

export default interface Histories {
    data: Container,
    action: "export" | "import" | "delete" | "edit",
    timeStamp: string,
    createBy: string
};