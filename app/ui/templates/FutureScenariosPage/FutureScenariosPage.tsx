"use client";

import { useState, useEffect, useRef } from "react";
import "./FutureScenariosPage.css";
import { Slider } from "../../molecules/Slider";
import {
  ScenarioThemeContent,
  ScenarioType,
  SlidersDataType,
  ThemesDataType,
  ThemeType,
  TileDataType,
  TileImageType,
} from "@/lib/types";
import { Tile } from "./Tile";
import { IconArrowDown } from "@/ui/atoms/icons";
import { useWindowSize } from "@/lib/useWindowSize";
import { ModalScenarioTheme } from "./ModalScenarioTheme";
import { MegaLoadingButton } from "@/ui/organisms/MegaLoadingButton";
import Image from "next/image";

interface FutureScenariosPageProps {
  isActivePage: boolean;
  slidersData: SlidersDataType;
  scenariosData: ScenarioType[];
  tilesData: TileDataType[];
  tileImages: TileImageType[];
  themesData: ThemesDataType;
  scenarioThemeContentData: ScenarioThemeContent[];
}

export const FutureScenariosPage = ({
  isActivePage,
  scenariosData,
  slidersData,
  tilesData,
  tileImages,
  themesData,
  scenarioThemeContentData,
}: FutureScenariosPageProps) => {
  const islandRef = useRef<HTMLDivElement | null>(null);
  const islandCloneRef = useRef<HTMLDivElement | null>(null);
  const tilesWrapperRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tilesWrapperCloneRef = useRef<HTMLDivElement | null>(null);
  const tileCloneRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const regionSlidersRef = useRef<HTMLDivElement | null>(null);
  const slidersTitleRef = useRef<HTMLDivElement | null>(null);
  const slidersWrapperRef = useRef<HTMLDivElement | null>(null);
  const slidersInnerRef = useRef<HTMLDivElement | null>(null);
  const slidersContentRef = useRef<HTMLDivElement | null>(null);

  const { width, height } = useWindowSize();

  const [showFutureScenarios, setShowFutureScenarios] =
    useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [tileImagesLoading, setTileImagesLoading] = useState<boolean>(true);

  const [currentScenario, setCurrentScenario] = useState(scenariosData[0]);
  const [currentTheme, setCurrentTheme] = useState<ThemeType | undefined>();

  const currentScenarioThemeContent = scenarioThemeContentData.find(
    (item) =>
      item.scenario_id === currentScenario.id &&
      item.theme_id === currentTheme?.id
  );

  const slidersDataRenderable = [];
  for (const group_name of Object.keys(slidersData)) {
    slidersDataRenderable.push({
      group_name,
      sliders: slidersData[group_name],
    });
  }

  const processTilesWrapperDimensions = () => {
    const islandWidth: number = islandRef.current!.clientWidth;
    const islandHeight: number = islandRef.current!.clientHeight;
    if (islandWidth >= islandHeight) {
      tilesWrapperRef.current!.style.height = `${islandHeight}px`;
      tilesWrapperRef.current!.style.width = `${islandHeight}px`;

      tilesWrapperCloneRef.current!.style.height = `${islandHeight}px`;
      tilesWrapperCloneRef.current!.style.width = `${islandHeight}px`;
    } else {
      tilesWrapperRef.current!.style.height = `${islandWidth}px`;
      tilesWrapperRef.current!.style.width = `${islandWidth}px`;

      tilesWrapperCloneRef.current!.style.height = `${islandWidth}px`;
      tilesWrapperCloneRef.current!.style.width = `${islandWidth}px`;
    }
  };

  useEffect(() => {
    if (!width || !height || !islandRef?.current) return;

    const frontPageWrapperElement: HTMLElement | null = document.querySelector(
      ".front-page-wrapper"
    );
    // Return if not frontpage
    if (!frontPageWrapperElement) return;

    const pageHeaderElement: HTMLElement =
      document.querySelector(".page-header")!;

    const infoElement = document.getElementById("info") as HTMLElement;

    // Set Front Page Wrapper height
    const page_header_height = pageHeaderElement.clientHeight;
    const page_wrapper_height = height - page_header_height;
    if (width >= 1024) {
      frontPageWrapperElement.style.height = `${page_wrapper_height}px`;
    } else {
      frontPageWrapperElement.style.height = `${height}px`;
    }

    /*
     * Make tiles element to be square
     */
    processTilesWrapperDimensions();

    /*
     * Set sliders-inner height and position (to enable scrolling)
     */
    slidersWrapperRef.current!.style.height = `${regionSlidersRef.current!.clientHeight - slidersTitleRef.current!.clientHeight}px`;

    // Resize regions on mouse moves
    const handleMouseEnterRegionSliders = () => {
      islandRef.current!.style.width = "50%";
      regionSlidersRef.current!.style.width = "50%";
    };
    const handleMouseLeaveRegionSliders = () => {
      islandRef.current!.style.width = "";
      regionSlidersRef.current!.style.width = "";
    };

    // Expand slider region on hover on small desktop sizes
    if (
      regionSlidersRef?.current &&
      islandRef.current &&
      width >= 1024 &&
      width < 1360
    ) {
      regionSlidersRef.current.addEventListener(
        "mouseenter",
        handleMouseEnterRegionSliders
      );
      regionSlidersRef.current.addEventListener(
        "mouseleave",
        handleMouseLeaveRegionSliders
      );
    }

    return () => {
      if (regionSlidersRef?.current) {
        regionSlidersRef.current.removeEventListener(
          "mouseenter",
          handleMouseEnterRegionSliders
        );
        regionSlidersRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeaveRegionSliders
        );
      }
    };
  }, [width, height]);

  const [renderTileIsland, setRenderTileIsland] = useState(false);
  useEffect(() => {
    setRenderTileIsland(true);

    if (showFutureScenarios) {
      document.body.classList.add("show-future-scenarios");
    } else {
      document.body.classList.remove("show-future-scenarios");
    }

    return () => {
      document.body.classList.remove("show-future-scenarios");
    };
  }, [showFutureScenarios]);

  const updateLoadedCount = (loadedCount: number) => {
    const percentLoaded = Math.round((loadedCount / tileImages.length) * 100);
    setLoadingProgress(percentLoaded);

    if (loadedCount === tileImages.length) {
      setTileImagesLoading(false);
    }
  };

  return (
    <main
      className={[
        "front-page-wrapper",
        isActivePage ? "is-active-page" : null,
      ].join(" ")}
    >
      <div className="loading-scenarios">
        <div className="loading-scenarios-inner">
          <div className="loading-island-wrapper">
            <Image
              src="/loading-island.svg"
              width={686}
              height={837}
              alt=""
              priority
            />
          </div>

          <div className="loading-scenarios-info">
            <div className="loading-scenarios-info-inner">
              <div>
                <p>
                  What might the futures of Europe look like in 2035,
                  considering political, social, legal, technological, economic
                  trends and perspectives? FUTEUR 35 is an interactive
                  exploration of extensive research efforts conducted throughout
                  2024.
                </p>
              </div>
              <div>
                <MegaLoadingButton
                  isLoading={tileImagesLoading}
                  loadingPercent={loadingProgress}
                  isLoadingText="Loading futures..."
                  loadingCompleteText="Start exploring!"
                  handleClick={() => {
                    setShowFutureScenarios(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="region-island" className="region-island">
        <div className="island" ref={islandRef}>
          <div className="tiles-wrapper" ref={tilesWrapperRef}>
            {renderTileIsland
              ? tilesData.map((tile, index) => {
                  return (
                    <Tile
                      key={tile.id}
                      index={index}
                      tileData={tile}
                      currentScenario={currentScenario}
                      scenariosData={scenariosData}
                      onlyWrapper={false}
                      themesData={themesData}
                      currentTheme={currentTheme}
                      setCurrentTheme={setCurrentTheme}
                      tileRefs={tileRefs}
                      tileCloneRefs={tileCloneRefs}
                      tilesWrapperRef={tilesWrapperRef}
                      updateLoadedCount={updateLoadedCount}
                    />
                  );
                })
              : null}

            <div className="island-base-left" />
            <div className="island-base-right" />

            <div className="island-scenario-title">
              {scenariosData.map((scenario, i) => {
                return (
                  <img
                    key={`scenario-title-${i}`}
                    src={`/scenario_titles/${scenario.id}.svg`}
                    alt={scenario.name}
                    className={
                      currentScenario.id === scenario.id ? "is-active" : ""
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* We need zoomed in island clone to calculate the zoom-in animation position */}
        <div className="island zoomed-in-clone" ref={islandCloneRef}>
          <div className="tiles-wrapper" ref={tilesWrapperCloneRef}>
            {tilesData.map((tile, index) => {
              return (
                <Tile
                  key={tile.id}
                  index={index}
                  tileData={tile}
                  currentScenario={currentScenario}
                  scenariosData={scenariosData}
                  onlyWrapper={true}
                  tileRefs={tileCloneRefs}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div
        id="region-sliders"
        className="region-sliders"
        ref={regionSlidersRef}
      >
        <div className="sliders-title" ref={slidersTitleRef}>
          <button
            className="button-choose-future"
            onClick={() => {
              if (document.body.classList.contains("mobile-sliders-open")) {
                document.body.classList.remove("mobile-sliders-open");
              } else {
                document.body.classList.add("mobile-sliders-open");
              }
              processTilesWrapperDimensions();
            }}
          >
            <span>Choose a future</span>
            <IconArrowDown />
          </button>
        </div>

        <div className="sliders-wrapper" ref={slidersWrapperRef}>
          <div className="sliders-inner" ref={slidersInnerRef}>
            <div className="sliders-content" ref={slidersContentRef}>
              {slidersDataRenderable.map((item_group, i) => {
                return (
                  <div key={`group-${i}`} className="slider-group">
                    <h2 className="slider-group-title">
                      {item_group.group_name}
                    </h2>

                    {item_group.sliders?.map((item_slider, j) => {
                      return (
                        <Slider
                          key={`slider-${j}`}
                          scenariosData={scenariosData}
                          item_slider={item_slider}
                          currentScenario={currentScenario}
                          setCurrentScenario={setCurrentScenario}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ModalScenarioTheme
        currentScenarioThemeContent={currentScenarioThemeContent}
        tilesWrapperRef={tilesWrapperRef}
        tileRefs={tileRefs}
      />
    </main>
  );
};
