/** @format */

import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "@/props/Card";
import CountUp from "react-countup"

export default function Card(props: CardProps) {
  return (
    <CardContent>
      <section className="flex justify-between gap-2">
        {/* label */}
        <p className="text-sm">{props.label}</p>
        {/* icon */}
        <props.icon className="h-4 w-4 text-gray-400" />
      </section>
      <section className="flex flex-col gap-1">
        <div className="flex">
          <CountUp className="text-2xl font-semibold" start={0} end={parseInt(props.amount)} duration={1.5} separator="," />
          <h1 className="text-2xl font-semibold translate-x-1">{props.amount.replace(String(parseInt(props.amount)), "")}</h1>
        </div>
        <p className="text-xs text-gray-500">{props.discription}</p>
      </section>
    </CardContent>
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
        props.className
      )}
    />
  );
}
