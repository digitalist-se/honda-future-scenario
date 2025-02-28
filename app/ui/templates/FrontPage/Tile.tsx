import { ScenarioType, ThemesDataType, ThemeType } from "@/lib/types";
import "./Tile.css";

interface TileProps {
  tileData: any;
  currentScenario: ScenarioType;
  scenariosData: ScenarioType[];
  onlyWrapper?: boolean;
  themesData?: ThemesDataType;
  currentTheme?: ThemeType;
  setCurrentTheme?: any;
}

export const Tile = ({
  tileData,
  currentScenario,
  scenariosData,
  onlyWrapper,
  themesData,
  currentTheme,
  setCurrentTheme,
}: TileProps) => {
  const handleOnClick = () => {
    setCurrentTheme(themesData![tileData.theme]);
  };

  return (
    <div
      className="tile"
      data-theme={tileData.theme}
      data-tile-id={tileData.id}
      onClick={handleOnClick}
    >
      {!onlyWrapper
        ? scenariosData.map((scenario, i) => {
            return (
              <img
                key={`tile-${i}`}
                src={`/tiles/${tileData[scenario.id]}`}
                alt={tileData.theme}
                className={
                  currentScenario.id === scenario.id
                    ? "is-current-scenario"
                    : ""
                }
              />
            );
          })
        : null}
    </div>
  );
};
