"use client";

import {
  PlotOptions,
  barY,
  lineY,
  areaY,
  axisX,
  axisY,
} from "@observablehq/plot";
import React, { useState } from "react";
import PlotComponent from "./ui/plot-react";

interface Props {
  data: object[];
  toolbar?: React.ReactElement;
  timeAccessor: (arr: object) => Date;
  yAccessor: string;
  xAccessor?: string;
  fillAccessor?: string;
}

function createChartOption(chartType: string) {
  switch (chartType) {
    case "line":
      return lineY;
    case "area":
      return areaY;
    case "bar":
      return barY;
    default:
      return lineY;
  }
}

function createDrawOption(chartType: string, breakdownKey: string) {
  switch (chartType) {
    case "line":
      return { stroke: breakdownKey };
    case "area":
      return { fill: breakdownKey };
    case "bar":
      return { fill: breakdownKey };
    default:
      return lineY;
  }
}

export default function TimeSeriesChart({
  data,
  timeAccessor,
  yAccessor,
  xAccessor = "time",
  fillAccessor,
}: Props) {
  const [chartType, setChartType] = useState("bar");

  const newData = data.map((d) => ({ ...d, time: timeAccessor(d) }));

  const options: PlotOptions = {
    y: {
      domain: [0, 100],
      percent: true,
    },
    axis: null,
    marks: [
      createChartOption(chartType)(newData, {
        x: xAccessor,
        y: yAccessor,
        fill: fillAccessor,
        tip: { fill: "black" },
      }),
      axisY({ label: null }),
      axisX({ ticks: "day" }),
    ],
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {data?.[0] ? (
          <PlotComponent options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            No Data in Time Range{" "}
          </div>
        )}
      </div>
    </div>
  );
}
