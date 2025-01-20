"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import handleLogin from "./handles/handleLogin";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (session && status == "authenticated" && session.user.role == "admin") {
      redirect("/pages/dashboards/admin")
    }
  }, [session, status])
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
  function resetPage() {
    loginForm.reset();
    (document.getElementById("submit-btn") as HTMLButtonElement).disabled = false;
    (document.getElementById("submit-btn")).innerHTML = `เข้าสู่ระบบ`;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6 flex-col">
      <Image className="mt-4" src={"/admin-icons.png"} width={200} height={200} alt="Logo" />
      <h2 className="text-xl font-bold mt-6 mb-4">การเข้าสู่ระบบสำหรับผู้ควบคุม</h2>
      <Form {...loginForm}>
        <form className="w-full max-w-sm mx-auto space-y-3" onSubmit={loginForm.handleSubmit((data) => handleLogin(data, setErrors, routers, () => { resetPage() }))}>
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
    </div>
  );
}
