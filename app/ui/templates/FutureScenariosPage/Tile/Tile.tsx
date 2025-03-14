import {
  ScenarioType,
  ThemesDataType,
  ThemeType,
  TileDataType,
} from "@/lib/types";
import "./Tile.css";
import Image from "next/image";
import { useWindowSize } from "@/lib/useWindowSize";

interface TileProps {
  index: number;
  tileData: TileDataType;
  currentScenario: ScenarioType;
  scenariosData: ScenarioType[];
  onlyWrapper?: boolean;
  themesData?: ThemesDataType;
  currentTheme?: ThemeType;
  setCurrentTheme?: any;
  tileRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  tileCloneRefs?: React.RefObject<(HTMLButtonElement | null)[]>;
  tilesWrapperRef?: React.RefObject<HTMLDivElement | null>;
}

export const Tile = ({
  index,
  tileData,
  currentScenario,
  scenariosData,
  onlyWrapper,
  themesData,
  currentTheme,
  setCurrentTheme,
  tileRefs,
  tileCloneRefs,
  tilesWrapperRef,
}: TileProps) => {
  const { width, height } = useWindowSize();

  const handleOnClick = () => {
    // No action
    // - if tiles already zoomed in
    // - tile clone refs are not provided
    // - either window width or height is undefined
    if (
      tileRefs.current[index]?.classList.contains("zoomed-in") ||
      !tileCloneRefs ||
      !tilesWrapperRef?.current ||
      !width ||
      !height
    ) {
      return;
    }

    document.body.classList.remove("mobile-menu-open");
    document.body.classList.add("tile-selected");

    const activeTheme = tileData.theme;
    for (const tileElement of tileRefs.current) {
      if (tileElement) {
        tileElement.classList.add("zoomed-in");
        if (tileElement.getAttribute("data-theme") === activeTheme) {
          tileElement.classList.add("active-theme");
        } else {
          tileElement.classList.add("inactive-theme");
        }
      }
    }

    const zoomedInTileElement = tileCloneRefs.current[index];
    if (!zoomedInTileElement) return;
    const zoomedInTileRect = zoomedInTileElement.getBoundingClientRect();

    const leftOffset =
      width / 2 - zoomedInTileRect.left - zoomedInTileRect.width / 2;
    const topOffset =
      height / 2 - zoomedInTileRect.top - zoomedInTileRect.height / 2;

    tilesWrapperRef.current.style.left = `${leftOffset}px`;
    tilesWrapperRef.current.style.top = `${topOffset}px`;
    tilesWrapperRef.current.style.scale = "1.4";

    setCurrentTheme(themesData![tileData.theme]);
  };

  return (
    <button
      className="tile"
      data-theme={tileData.theme}
      data-tile-id={tileData.id}
      onClick={handleOnClick}
      ref={(el) => {
        tileRefs.current[index] = el;
      }}
    >
      {!onlyWrapper
        ? scenariosData.map((scenario, i) => {
            return (
              <Image
                key={`tile-${i}`}
                src={`/tiles/${tileData[scenario.id]}`}
                alt={tileData.theme}
                className={
                  currentScenario.id === scenario.id
                    ? "is-current-scenario"
                    : ""
                }
                width={300}
                height={300}
              />
            );
          })
        : null}
    </button>
  );
};
