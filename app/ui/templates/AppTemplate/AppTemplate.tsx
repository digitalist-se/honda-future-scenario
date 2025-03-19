"use client";

import { useEffect, useState } from "react";
import {
  ScenarioThemeContent,
  ScenarioType,
  SlidersDataType,
  ThemesDataType,
  TileDataType,
  TileImageType,
} from "@/lib/types";
import { Header } from "@/ui/templates/Layout/Header";
import { FutureScenariosPage } from "../FutureScenariosPage";
import { AboutPage } from "../AboutPage";

interface AppTemplateProps {
  lang: string;
  slidersData: SlidersDataType;
  scenariosData: ScenarioType[];
  tilesData: TileDataType[];
  tileImages: TileImageType[];
  themesData: ThemesDataType;
  scenarioThemeContentData: ScenarioThemeContent[];
}

export const AppTemplate = ({
  lang,
  scenariosData,
  slidersData,
  tilesData,
  tileImages,
  themesData,
  scenarioThemeContentData,
}: AppTemplateProps) => {
  const [currentPage, setCurrentPage] = useState<string>("front");

  useEffect(() => {
    document.body.classList.add("navigate-animate-in");
  }, []);

  return (
    <>
      <Header
        lang={lang}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FutureScenariosPage
        isActivePage={currentPage === "front"}
        scenariosData={scenariosData}
        slidersData={slidersData}
        tilesData={tilesData}
        tileImages={tileImages}
        themesData={themesData}
        scenarioThemeContentData={scenarioThemeContentData}
      />

      <AboutPage isActivePage={currentPage === "about"} />
    </>
  );
};
