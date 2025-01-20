/** @format */
"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar
} from "recharts";
import BarData from "@/configs/BarDatas"
import Histories from "@/props/Histories";
import BarDataProps from "@/props/BarData";

type Props = {};


export default function BarChart({ }: Props) {
  const [bData, setbData] = useState<BarDataProps[]>()
  useEffect(() => {
    const fetchData = async () => {
      const data = structuredClone(BarData)
      const response1 = await fetch("http://localhost:3000/api/stock/histories/get")
      const histories = (await response1.json() as { data: Histories[] }).data
      for (let i = 1; i <= 12; i++) {
        const sellP = histories.filter(x => x.action == "export").filter(x => x.timeStamp.split("/")[0] == `${i}`).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].sellPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
        const importCost = histories.filter(x => x.action == "import").filter(x => x.timeStamp.split("/")[0] == `${i}`).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].costPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
        const deleteSell = histories.filter(x => x.action == "delete").filter(x => x.timeStamp.split("/")[0] == `${i}`).filter(x => x.data.stock.length == 1).map(x => x.data.stock[0].costPrice * x.data.stock[0].amount).reduce((a, b) => a + b, 0)
        data[i - 1].total = sellP - (importCost - deleteSell);
      }
      setbData(data)
    }
    fetchData()
  }, [])
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={bData}>
        <XAxis
          dataKey={"name"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey={"total"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}
