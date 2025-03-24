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
import { Header } from "@/ui/Layout/Header";
import { FutureScenariosPage } from "../FutureScenariosPage";
import { AboutPage } from "@/ui/AboutPage";

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

  const navigateToPage = (page: string) => {
    if (currentPage !== page) {
      document.body.classList.remove("mobile-menu-open");
      document.body.classList.remove("navigate-animate-in");
      document.body.classList.add("navigate-animate-out");

      setTimeout(() => {
        document.body.classList.remove("navigate-animate-out");
        setCurrentPage(page);

        setTimeout(() => {
          document.body.classList.add("navigate-animate-in");
        }, 50);
      }, 1000);
    }
  };

  return (
    <>
      <Header
        lang={lang}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        navigateToPage={navigateToPage}
      />

      <FutureScenariosPage
        lang={lang}
        isActivePage={currentPage === "front"}
        scenariosData={scenariosData}
        slidersData={slidersData}
        tilesData={tilesData}
        tileImages={tileImages}
        themesData={themesData}
        scenarioThemeContentData={scenarioThemeContentData}
        navigateToPage={navigateToPage}
      />

      <AboutPage isActivePage={currentPage === "about"} />
    </>
  );
};
