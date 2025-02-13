'use client'

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Github, GithubIcon, LucideGithub } from "lucide-react";

export default function GuidePage() {
  const [articles] = useState([
    { title: "เริ่มต้นใช้งาน", content: <div><p>การเข้าสู่ระบบสำหรับพนักงานและผู้ควบคุมระบบ สามารถล็อกอินได้ด้วยชื่อผู้ใช้ <strong>admin</strong> และรหัสผ่าน <strong>password</strong> เพื่อเริ่มต้นการเพิ่มสต็อกสินค้าและการจัดการระบบ โดยพนักงานจะมีสิทธิ์เข้าถึงบางส่วนของระบบเท่านั้น</p><div className="flex justify-center"><img className="w-1/2 h-1/2 rounded-lg" src="./loginAdmin.png" alt="ล็อกอิน"></img></div></div>, image: "/login.png" },
    { title: "หน้าหลัก", content: <div><p>เมื่อเข้าสู่ระบบสำเร็จแล้ว ผู้ใช้จะเห็นหน้าหลักซึ่งรวมรายงานการเงิน เช่น รายรับ-รายจ่าย กำไร รวมถึงกราฟแท่งที่แสดงการเปรียบเทียบกำไรในแต่ละเดือน และรายการส่งออกสินค้าล่าสุด</p></div>, image: "dashboard.png" },
    { title: "จัดการสินค้า", content: <div><p>ในหน้าจัดการสินค้าผู้ใช้สามารถเพิ่มและจัดการสินค้าต่างๆ ได้ รวมถึงการเพิ่มสต็อกหรือการบันทึกการส่งออกสินค้า ซึ่งช่วยให้ระบบมีความพร้อมใช้งานและจัดการสินค้าตามความต้องการได้ตลอดเวลา</p></div>, image: "/products.png" },
    { title: "จัดการพนักงาน", content: <div><p>หน้าจัดการพนักงานช่วยให้ผู้ควบคุมระบบสามารถเพิ่มและจัดการข้อมูลพนักงานได้ โดยสามารถสร้างบัญชีพนักงานใหม่ เเละสามารถชื่อผู้ใช้เเละรหัสผ่านไปเพื่อให้พนักงานเข้าสู่ระบบ</p></div>, image: "/employee.png" },
    { title: "รายงาน", content: <div><p>ในหน้ารายงาน ผู้ใช้สามารถตรวจสอบประวัติการทำรายการต่างๆ เช่น การเพิ่ม ลบ แก้ไข หรือส่งออกสินค้าของผู้ใช้แต่ละคน ซึ่งช่วยให้ผู้ควบคุมระบบสามารถติดตามและตรวจสอบการดำเนินงานของพนักงานได้อย่างละเอียด</p></div>, image: "/reports.png" },
    { title: "การแจ้งเตือน", content: <div><p>หน้าการแจ้งเตือนแสดงรายการสินค้าที่ใกล้หมด เพื่อให้ผู้ดูแลระบบสามารถเตรียมการเติมสต็อกได้ทันเวลา ทำให้ไม่เกิดปัญหาสินค้าหมดสต็อกในช่วงที่ต้องการใช้งาน</p></div>, image: "/nofications.png" },
    { title: "การตั้งค่า", content: <div><p>ในหน้าการตั้งค่า ผู้ใช้สามารถปรับแต่งการตั้งค่าต่างๆ เช่น การเปลี่ยนธีมเว็บไซต์ เปิด-ปิดการแจ้งเตือน หรือการตั้งค่าจำนวนสินค้าที่เหลือน้อยเพื่อให้ระบบทำการเตือนล่วงหน้าเมื่อสินค้ากำลังจะหมด</p></div>, image: "/settings.png" }
  ]);

  return (
    <div className="p-6 w-full mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className={"flex justify-end"}>ดูซอร์สโค้ดได้ที่ <div className="w-3"></div><LucideGithub onClick={() => redirect("https://github.com/PUKAN223/next-test")}></LucideGithub></h1>
      </motion.div>
      <div className="h-3"></div>
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        คู่มือการใช้งาน
      </motion.h1>
      <motion.h2
        className="flex text-xl mb-6 text-center justify-center w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        สามารถอ่านวิธีการใช้งานได้ที่ด้านล่างหรือทดลองใช้เว็บไซต์ได้ที่
        <div className="w-5"></div>
        <Button className="translate-y-[-3px]" variant={"secondary"} onClick={() => redirect("/")}>ไปที่เว็บไซต์</Button>
      </motion.h2>
      <div className="space-y-16">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} space-x-4`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.img
              src={article.image}
              alt={article.title}
              className="object-cover rounded-lg shadow-l border w-full md:w-1/2 md:h-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="w-10 h-10"></div>
            <Card className="p-4 border rounded-lg flex-1">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <CardContent>{article.content}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="w-10 h-5"></div>
      <motion.div
        className={`flex items-center space-x-4`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 6 * 0.2 }}
        viewport={{ once: true }}
      >
        <div className="w-full">
          <Button className={"w-full flex justify-center items-center text-center flex-row"} variant={"secondary"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>ทดลองใช้งานเว็บไซต์</Button>
        </div>
      </motion.div>
    </div>
  );
}
