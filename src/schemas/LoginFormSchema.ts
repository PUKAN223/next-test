import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "ชื่อจำเป็นต้องมี 2 พยางค์ขึ้นไป",
    }),
    password: z.string().min(1, {
        message: "กรุณากรอกรหัสผ่าน"
    })
})

export default formSchema