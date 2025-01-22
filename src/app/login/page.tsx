"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import handleLogin from "./handles/handleLogin";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const routers = useRouter()
  const [errors, setErrors] = useState({
    user: null,
    password: null
  })
  const loginForm = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session && session.user.role == "user" && status == "authenticated") {
      routers.push("/pages/dashboards");
    }
  }, [session, routers]);

  function resetPage() {
    loginForm.reset();
    (document.getElementById("submit-btn") as HTMLButtonElement).disabled = false;
    (document.getElementById("submit-btn")).innerHTML = `เข้าสู่ระบบ`;
    setErrors({
      user: null,
      password: null
    })
  }

  console.log(status)

  return (
    <div className="flex justify-center items-center min-h-screen p-6 flex-col bg-gray-50">
      <Image className="mt-4" src={"/stock-icons.png"} width={200} height={200} alt="Logo" />
      <h2 className="text-xl font-bold mt-6 mb-4">การเข้าสู่ระบบสำหรับพนักงาน</h2>
      <Form {...loginForm}>
        <form className="w-full max-w-sm mx-auto space-y-3" onSubmit={loginForm.handleSubmit((data) => handleLogin(data, setErrors, routers, () => resetPage()))}>
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ชื่อผู้ใช้
                  {errors.user && (
                    <span className="text-red-500 text-sm ml-2">* {errors.user}</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  รหัสผ่าน
                  {errors.password && (
                    <span className="text-red-500 text-sm ml-2">* {errors.password}</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4" id="submit-btn">เข้าสู่ระบบ</Button>
        </form>
      </Form>
      <div className="flex translate-y-5">
        <p>
          หากต้องการเข้าสู่ระบบสำหรับเเอดมิน
        </p>
        <a className="text-blue-500" href="login/admin">
          คลิ้กที่นี่
        </a>
      </div>
    </div>
  );
}
