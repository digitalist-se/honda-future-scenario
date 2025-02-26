"use client";

import { useState, useEffect } from "react";
import "./FrontPage.css";
import { FrontPageClient } from "./FrontPageClient";
import { Slider } from "../../molecules/Slider";
import { ScenarioType, SlidersDataType } from "@/lib/types";
import { Tile } from "./Tile";
import { IconClose } from "@/ui/atoms/icons";

interface FrontPageProps {
  slidersData: SlidersDataType;
  scenariosData: ScenarioType[];
  tileData: any[];
}

export const FrontPage = ({
  scenariosData,
  slidersData,
  tileData,
}: FrontPageProps) => {
  const [currentScenario, setCurrentScenario] = useState(scenariosData[0]);

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
                    data={tile}
                    currentScenario={currentScenario}
                    scenariosData={scenariosData}
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
                {/* <img
                  src={`/scenario_titles/${currentScenario.id}.svg`}
                  alt={currentScenario.name}
                /> */}
              </div>
            </div>
          </div>

          {/* We need zoomed in island clone to calculate the zoom-in animation position */}
          <div className="island zoomed-in-clone">
            <div className="tiles">
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
              <div className="tile" />
            </div>
          </div>
        </div>

        <div id="region-sliders" className="region-sliders">
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

        <div className="modal-scenario-theme">
          <button className="modal-close">
            <IconClose />
          </button>
          <div className="mst-title-wrapper">
            <strong>Growth & Trade</strong> | Asleep at the Wheel
          </div>
          <div className="mst-content-wrapper">
            <p>
              But I must explain to you how all this mistaken idea of denouncing
              of a pleasure and praising pain was born and I will give you a
              complete account of the system, and expound the actual teachings
              of the great explorer of the truth, the master-builder of human
              happiness. No one rejects, dislikes, or avoids pleasure itself,
              because it is pleasure, but because those who do not know how to
              pursue pleasure rationally encounter consequences that are
              extremely painful.
            </p>
          </div>
        </div>
      </main>
      <FrontPageClient />
    </>
  );
};
