import { Header } from "@/ui/templates/Layout/Header/Header";
import { FrontPage } from "@/ui/templates/FrontPage";
import { SlidersDataType, SliderType, ScenarioType } from "@/lib/types";
import { getDataFromCSV } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  //
  // Scenarios data
  //
  const scenariosDataRaw = getDataFromCSV("scenarios.csv") as ScenarioType[];

  //
  // Sliders data
  //
  const slidersDataRaw = getDataFromCSV("sliders.csv") as SliderType[];
  // Group sliders data by "group" param
  const slidersData: SlidersDataType = {};
  for (const item of slidersDataRaw) {
    if (!slidersData[item.group]) {
      slidersData[item.group] = [];
    }
    slidersData[item.group].push(item);
  }

  //
  // Themes
  //

  //
  // Tile Themes
  //
  const tileData = getDataFromCSV("tiles.csv") as any;
  // const tileData: any = {};
  // for (const item of tileDataRaw) {
  //   tileData[item.id] = item;
  // }

  return (
    <>
      <Header lang={lang} currentPage="front" />
      <FrontPage
        scenariosData={scenariosDataRaw}
        slidersData={slidersData}
        tileData={tileData}
      />
    </>
  );
}
