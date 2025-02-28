import { Header } from "@/ui/templates/Layout/Header/Header";
import { FrontPage } from "@/ui/templates/FrontPage";
import {
  SlidersDataType,
  SliderType,
  ScenarioType,
  ThemesDataType,
  ThemeType,
  ScenarioThemeContent,
} from "@/lib/types";
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
  const themesDataRaw = getDataFromCSV("themes.csv") as ThemeType[];
  const themesData: ThemesDataType = {};
  for (const theme of themesDataRaw) {
    themesData[theme.id] = theme;
  }

  //
  // Tile Themes
  //
  const tileData = getDataFromCSV("tiles.csv") as any;

  //
  // Scenario Theme Content
  const scenarioThemeContentData = getDataFromCSV(
    "scenario_theme_content.csv"
  ) as ScenarioThemeContent[];

  return (
    <>
      <Header lang={lang} currentPage="front" />
      <FrontPage
        scenariosData={scenariosDataRaw}
        slidersData={slidersData}
        tileData={tileData}
        themesData={themesData}
        scenarioThemeContentData={scenarioThemeContentData}
      />
    </>
  );
}
