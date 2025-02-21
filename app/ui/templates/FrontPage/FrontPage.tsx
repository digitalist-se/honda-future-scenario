import "./FrontPage.css";
import { FrontPageClient } from "./FrontPageClient";
import { Slider } from "../../molecules/Slider";

export const FrontPage = () => {
  return (
    <>
      <main className="front-page-wrapper">
        <div id="region-island" className="region-island">
          <div className="island">
            <div className="tiles">
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile has-image">
                <img src="/demo-tile.png" alt="Tile" />
              </div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile "></div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile has-image">
                <img src="/demo-tile.png" alt="Tile" />
              </div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile"></div>
              <div className="tile has-image">
                <img src="/demo-tile.png" alt="Tile" />
              </div>

              <div className="island-base-left" />
              <div className="island-base-right" />

              <div className="island-scenario-title">
                {/* <img src="/scenario-asleep.svg" alt="Scenario name" /> */}
                <img src="/scenario-tech-titans.svg" alt="Scenario name" />
              </div>
            </div>
          </div>
        </div>
        <div id="region-sliders" className="region-sliders">
          <div className="region-sliders-inner">
            <div className="region-sliders-content">
              <h1 className="sliders-title">Choose a future</h1>

              <div className="slider-group">
                <h2 className="slider-group-title">Global power shifts</h2>
                <Slider
                  labelMin="Status quo"
                  labelMax="Revised"
                  defaultValue="6"
                />
                <Slider
                  labelMin="EU power increases"
                  labelMax="EU power reduces"
                  defaultValue="3"
                />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">
                  Global response to fight for raw materials
                </h2>
                <Slider
                  labelMin="Conflict"
                  labelMax="Cooperation"
                  defaultValue="4"
                />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">
                  Quality of EU innovation & infrastructure
                </h2>
                <Slider labelMin="Weak" labelMax="Strong" defaultValue="7" />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">Socialisation</h2>
                <Slider labelMin="Online" labelMax="Offline" defaultValue="7" />
                <Slider labelMin="Rare" labelMax="Daily" defaultValue="5" />
                <Slider
                  labelMin="Remote working"
                  labelMax="In-person working"
                  defaultValue="8"
                />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">
                  Adoption of sustainable behaviours
                </h2>
                <Slider
                  labelMin="Rare"
                  labelMax="Widespread"
                  defaultValue="7"
                />
                <Slider
                  labelMin="Driven by government"
                  labelMax="Driven by self"
                  defaultValue="5"
                />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">Normalisation of VR/AR</h2>
                <Slider
                  labelMin="Rare"
                  labelMax="Mass adoption"
                  defaultValue="7"
                />
              </div>

              <div className="slider-group">
                <h2 className="slider-group-title">
                  Development of battery technology
                </h2>
                <Slider
                  labelMin="Incremental"
                  labelMax="Transformational"
                  defaultValue="7"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FrontPageClient />
    </>
  );
};
