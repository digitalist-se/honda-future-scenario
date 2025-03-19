import {
  SlidersDataType,
  SliderType,
  ScenarioType,
  ThemesDataType,
  ThemeType,
  ScenarioThemeContent,
  TileDataType,
  TileImageType,
} from "@/lib/types";
import { getDataFromCSV } from "@/lib/utils";
import { AppTemplate } from "@/ui/templates/AppTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Honda Future Scenarios",
  description:
    "FUTEUR 35 is an interactive exploration of extensive research efforts conducted throughout 2024.",
  openGraph: {
    title: "Honda Future Scenarios",
    description:
      "FUTEUR 35 is an interactive exploration of extensive research efforts conducted throughout 2024.",
    images: "/og-image.jpg",
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  //
  // Scenarios data
  //
  const scenariosData = getDataFromCSV("scenarios.csv") as ScenarioType[];

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
  const tilesData = getDataFromCSV("tiles.csv") as TileDataType[];
  const tileImages: TileImageType[] = [];
  for (const tileData of tilesData) {
    for (const scenarioData of scenariosData) {
      const image_name: string = tileData[scenarioData.id];

      const newTileImage = {
        tile_id: tileData.id,
        scenario_id: scenarioData.id,
        image_url: `/tiles/${scenarioData.id}/${image_name}`,
      };
      tileImages.push(newTileImage);
    }
  }

  //
  // Scenario Theme Content
  const scenarioThemeContentData = getDataFromCSV(
    "scenario_theme_content.csv"
  ) as ScenarioThemeContent[];

  return (
    <AppTemplate
      lang={lang}
      scenariosData={scenariosData}
      slidersData={slidersData}
      tilesData={tilesData}
      tileImages={tileImages}
      themesData={themesData}
      scenarioThemeContentData={scenarioThemeContentData}
    />
  );
}
