/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */

import { SalesProps } from "@/props/RecentSales";
import React from "react";

export default function SalesCard(props: SalesProps) {
  return (
    <div className="flex flex-wrap justify-between">
      <section className="flex justify-start gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1">
          <img width={200} height={200} src={`${props.logo}`} alt="avatar" />
        </div>
        <div className="text-sm">
            <p>{props.name}</p>
            <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
                หมายเหตุ: {props.description}
            </div>
        </div>
      </section>
      <p>{props.saleAmount}</p>
    </div>
  );
}
