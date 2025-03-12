"use client";

import { useState, useEffect } from "react";
import "./FrontPage.css";
import { FrontPageClient } from "./FrontPageClient";
import { Slider } from "../../molecules/Slider";
import {
  ScenarioThemeContent,
  ScenarioType,
  SlidersDataType,
  ThemesDataType,
  ThemeType,
} from "@/lib/types";
import { Tile } from "./Tile";
import { IconClose } from "@/ui/atoms/icons";

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

  return (
    <>
      <main className="front-page-wrapper">
        <div id="region-island" className="region-island">
          <div className="island">
            <div className="tiles">
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
          <div className="island zoomed-in-clone">
            <div className="tiles">
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

        <div id="region-sliders" className="region-sliders">
          <div className="region-sliders-scroll-wrapper">
            <div className="region-sliders-inner">
              <div className="region-sliders-content">
                <h1 className="sliders-title">Choose a future</h1>

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
      <FrontPageClient />
    </>
  );
};
