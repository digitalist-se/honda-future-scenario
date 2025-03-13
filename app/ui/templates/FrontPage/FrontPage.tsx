"use client";

import { useState, useEffect, useRef } from "react";
import "./FrontPage.css";
import { Slider } from "../../molecules/Slider";
import {
  ScenarioThemeContent,
  ScenarioType,
  SlidersDataType,
  ThemesDataType,
  ThemeType,
} from "@/lib/types";
import { Tile } from "./Tile";
import { IconClose, IconArrowDown } from "@/ui/atoms/icons";
import { useWindowSize } from "@/lib/useWindowSize";

interface FrontPageProps {
  slidersData: SlidersDataType;
  scenariosData: ScenarioType[];
  tileData: any[];
  themesData: ThemesDataType;
  scenarioThemeContentData: ScenarioThemeContent[];
}

export const FrontPage = ({
  scenariosData,
  slidersData,
  tileData,
  themesData,
  scenarioThemeContentData,
}: FrontPageProps) => {
  const islandRef = useRef<HTMLDivElement | null>(null);
  const islandCloneRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<HTMLDivElement | null>(null);
  const tilesCloneRef = useRef<HTMLDivElement | null>(null);
  const regionSlidersRef = useRef<HTMLDivElement | null>(null);
  const slidersTitleRef = useRef<HTMLDivElement | null>(null);
  const slidersWrapperRef = useRef<HTMLDivElement | null>(null);
  const slidersInnerRef = useRef<HTMLDivElement | null>(null);
  const slidersContentRef = useRef<HTMLDivElement | null>(null);

  const { width, height } = useWindowSize();

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

  const processTilesDimensions = () => {
    const islandWidth: number = islandRef.current!.clientWidth;
    const islandHeight: number = islandRef.current!.clientHeight;
    if (islandWidth >= islandHeight) {
      tilesRef.current!.style.height = `${islandHeight}px`;
      tilesRef.current!.style.width = `${islandHeight}px`;

      tilesCloneRef.current!.style.height = `${islandHeight}px`;
      tilesCloneRef.current!.style.width = `${islandHeight}px`;
    } else {
      tilesRef.current!.style.height = `${islandWidth}px`;
      tilesRef.current!.style.width = `${islandWidth}px`;

      tilesCloneRef.current!.style.height = `${islandWidth}px`;
      tilesCloneRef.current!.style.width = `${islandWidth}px`;
    }
  };

  useEffect(() => {
    if (!width || !height) return;

    const frontPageWrapperElement: HTMLElement | null = document.querySelector(
      ".front-page-wrapper"
    );
    // Return if not frontpage
    if (!frontPageWrapperElement) return;

    const pageHeaderElement: HTMLElement =
      document.querySelector(".page-header")!;

    const regionIslandElement: HTMLElement =
      document.getElementById("region-island")!;
    const regionSlidersElement: HTMLElement =
      document.getElementById("region-sliders")!;
    const regionSlidersScrollWrapperElement: HTMLElement =
      document.querySelector(".region-sliders-scroll-wrapper")!;
    const regionSlidersInnerElement: HTMLElement = document.querySelector(
      ".region-sliders-inner"
    )!;
    const regionSlidersContentElement: HTMLElement = document.querySelector(
      ".region-sliders-content"
    )!;
    const modalCloseButtonElement: HTMLButtonElement =
      document.querySelector(".modal-close")!;

    const islandElement = document.querySelector(
      ".island:not(.zoomed-in-clone)"
    ) as HTMLElement;
    const islandZoomedInCloneElement = document.querySelector(
      ".island.zoomed-in-clone"
    ) as HTMLElement;
    const tilesElement = document.querySelector(".tiles") as HTMLElement;

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
    processTilesDimensions();

    /*
     * Set sliders-inner height and position (to enable scrolling)
     */
    slidersWrapperRef.current!.style.height = `${regionSlidersRef.current!.clientHeight - slidersTitleRef.current!.clientHeight}px`;

    // Resize regions on mouse moves
    const handleMouseEnterRegionSliders = () => {
      islandElement.style.width = "50%";
      regionSlidersRef.current!.style.width = "50%";
    };
    const handleMouseLeaveRegionSliders = () => {
      islandElement.style.width = "";
      regionSlidersRef.current!.style.width = "";
    };

    // Expand slider region on hover on small desktop sizes
    if (width >= 1024 && width < 1360) {
      regionSlidersRef.current!.addEventListener(
        "mouseenter",
        handleMouseEnterRegionSliders
      );
      regionSlidersRef.current!.addEventListener(
        "mouseleave",
        handleMouseLeaveRegionSliders
      );
    }

    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((el) => {
      const tileElement = el as HTMLElement;

      tileElement.addEventListener("click", (e) => {
        //
        const selectedTileElement = e.currentTarget as HTMLElement;
        if (selectedTileElement.classList.contains("zoomed-in")) return;

        document.body.classList.remove("mobile-menu-open");
        document.body.classList.add("tile-selected");

        // Get selected theme
        const activeTheme: string =
          selectedTileElement.getAttribute("data-theme")!;
        // Mark selected theme tiles
        tileElements.forEach((el) => {
          const tileElement = el as HTMLElement;
          tileElement.classList.add("zoomed-in");
          if (tileElement.getAttribute("data-theme") === activeTheme) {
            tileElement.classList.add("active-theme");
          } else {
            tileElement.classList.add("inactive-theme");
          }
        });

        // Calculate zoom-in positions from already zoomed-in clone island
        const tileId = selectedTileElement.getAttribute("data-tile-id");
        const zoomedInTileElement = islandZoomedInCloneElement.querySelector(
          `[data-tile-id="${tileId}"]`
        )!;
        const zoomedInTileRect = zoomedInTileElement.getBoundingClientRect();

        const leftOffset =
          width / 2 - zoomedInTileRect.left - zoomedInTileRect.width / 2;
        const topOffset =
          height / 2 - zoomedInTileRect.top - zoomedInTileRect.height / 2;

        tilesRef.current!.style.left = `${leftOffset}px`;
        tilesRef.current!.style.top = `${topOffset}px`;
        tilesRef.current!.style.scale = "1.4";
      });
    });

    // Handle Modal content Close
    modalCloseButtonElement.addEventListener("click", () => {
      document.body.classList.remove("tile-selected");
      tileElements.forEach((el) => {
        const tileElement = el as HTMLElement;
        tileElement.classList.remove("zoomed-in");
        tileElement.classList.remove("active-theme");
        tileElement.classList.remove("inactive-theme");

        tilesRef.current!.style.left = ``;
        tilesRef.current!.style.top = ``;
        tilesRef.current!.style.scale = "";
      });
    });

    return () => {
      regionSlidersRef.current!.removeEventListener(
        "mouseenter",
        handleMouseEnterRegionSliders
      );
      regionSlidersRef.current!.removeEventListener(
        "mouseleave",
        handleMouseLeaveRegionSliders
      );
    };
  }, [width, height]);

  return (
    <main className="front-page-wrapper">
      <div id="region-island" className="region-island">
        <div className="island" ref={islandRef}>
          <div className="tiles" ref={tilesRef}>
            {tileData.map((tile) => {
              return (
                <Tile
                  key={tile.id}
                  tileData={tile}
                  currentScenario={currentScenario}
                  scenariosData={scenariosData}
                  onlyWrapper={false}
                  themesData={themesData}
                  currentTheme={currentTheme}
                  setCurrentTheme={setCurrentTheme}
                />
              );
            })}

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
          <div className="tiles" ref={tilesCloneRef}>
            {tileData.map((tile) => {
              return (
                <Tile
                  key={tile.id}
                  tileData={tile}
                  currentScenario={currentScenario}
                  scenariosData={scenariosData}
                  onlyWrapper={true}
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
              processTilesDimensions();
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

      <div className="modal-scenario-theme">
        <button className="modal-close">
          <IconClose />
        </button>
        <div className="mst-title-wrapper">
          <strong>{currentScenario.name}</strong> | {currentTheme?.name}
        </div>
        <div className="mst-content-wrapper">
          <div>
            {currentScenarioThemeContent?.text && (
              <p
                dangerouslySetInnerHTML={{
                  __html: currentScenarioThemeContent?.text,
                }}
              ></p>
            )}
          </div>
          {currentScenarioThemeContent?.image ? (
            <div className="image-wrapper">
              <img
                src={`/content/${currentScenarioThemeContent.image}`}
                alt=""
              />
            </div>
          ) : null}
        </div>
      </div>

      <div id="info"></div>
    </main>
  );
};
