import { Header } from "@/ui/templates/Layout/Header/Header";
import { FrontPage } from "@/ui/templates/FrontPage";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { SlidersDataType, SliderType } from "@/lib/types";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  // Sliders data
  const slidersFilePath = path.join(process.cwd(), "data", "sliders.csv");
  const slidersFileContent = fs.readFileSync(slidersFilePath, "utf8");
  const { data: slidersDataRaw } = Papa.parse<SliderType>(slidersFileContent, {
    header: true,
  });
  // Group sliders data
  const slidersData: SlidersDataType = {};
  for (const item of slidersDataRaw) {
    if (!slidersData[item.group]) {
      slidersData[item.group] = [];
    }

    slidersData[item.group].push(item);
  }

  return (
    <>
      <Header lang={lang} currentPage="front" />
      <FrontPage slidersData={slidersData} />
    </>
  );
}
