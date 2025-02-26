import { ScenarioType } from "@/lib/types";
import "./Tile.css";

interface TileProps {
  data: any;
  currentScenario: ScenarioType;
  scenariosData: ScenarioType[];
}

export const Tile = ({ data, currentScenario, scenariosData }: TileProps) => {
  return (
    <div className="tile">
      {scenariosData.map((scenario, i) => {
        return (
          <img
            key={`tile-${i}`}
            src={`/tiles/${data[scenario.id]}`}
            alt={data.theme}
            className={currentScenario.id === scenario.id ? "is-active" : ""}
          />
        );
      })}
    </div>
  );
};
