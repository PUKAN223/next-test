/** @format */
"use client";
import React, { useEffect, useState } from "react";
import BarData from "@/configs/BarDatas"
import Histories from "@/props/Histories";
import BarDataProps from "@/props/BarData";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

type Props = {};

const chartConfig = {
  total: {
    label: "กำไร",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function BarChartD({ }: Props) {
  const [bData, setbData] = useState<BarDataProps[]>()
  useEffect(() => {
    const fetchData = async () => {
      const data = structuredClone(BarData)
      const response1 = await fetch(`/api/stock/histories/get`)
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
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={bData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="total" fill="var(--color-desktop)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}