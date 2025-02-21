import "./FrontPage.css";
import { FrontPageClient } from "./FrontPageClient";
import { Slider } from "../../molecules/Slider";
import { SlidersDataType } from "@/lib/types";

interface FrontPageProps {
  slidersData: SlidersDataType;
}

export const FrontPage = ({ slidersData }: FrontPageProps) => {
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
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>
              <div className="tile has-image">
                <img src="/demo-tile-bottom.png" alt="Tile" />
              </div>

              <div className="island-base-left" />
              <div className="island-base-right" />

              <div className="island-scenario-title">
                {/* <img src="/scenario-asleep.svg" alt="Scenario name" /> */}
                <img src="/scenario-tech-titans.svg" alt="Scenario name" />
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
                          labelMin={item_slider.label_left}
                          labelMax={item_slider.label_right}
                          defaultValue="6"
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <FrontPageClient />
    </>
  );
};
