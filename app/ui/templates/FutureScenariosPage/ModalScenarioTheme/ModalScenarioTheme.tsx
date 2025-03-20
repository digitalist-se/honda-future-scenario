import { IconClose } from "@/ui/atoms/icons";
import "./ModalScenarioTheme.css";
import { useEffect } from "react";

interface ModalScenarioThemeProps {
  currentScenarioThemeContent: any;
  tilesWrapperRef: React.RefObject<HTMLDivElement | null>;
  tileRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  modalScenarioThemeRef: React.RefObject<HTMLDivElement | null>;
}

export const ModalScenarioTheme = ({
  currentScenarioThemeContent,
  tilesWrapperRef,
  tileRefs,
  modalScenarioThemeRef,
}: ModalScenarioThemeProps) => {
  const handleModalClose = () => {
    document.body.classList.remove("tile-selected");

    for (const tileElement of tileRefs.current) {
      tileElement!.classList.remove("zoomed-in");
      tileElement!.classList.remove("active-theme");
      tileElement!.classList.remove("inactive-theme");

      tilesWrapperRef.current!.style.left = ``;
      tilesWrapperRef.current!.style.top = ``;
      tilesWrapperRef.current!.style.scale = "";
    }
  };

  useEffect(() => {
    // Close modal on ESC key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="modal-scenario-theme" ref={modalScenarioThemeRef}>
      <button className="modal-close" onClick={handleModalClose}>
        <IconClose />
      </button>

      {currentScenarioThemeContent?.theme_id ? (
        <>
          <div className="mst-title-wrapper">
            {currentScenarioThemeContent.top_title ? (
              <div>
                <strong>{currentScenarioThemeContent.top_title}</strong>
                {currentScenarioThemeContent.top_subtitle
                  ? ` | ${currentScenarioThemeContent.top_subtitle}`
                  : null}
              </div>
            ) : null}
          </div>
          <div className="mst-content-wrapper">
            {!currentScenarioThemeContent?.title &&
            !currentScenarioThemeContent?.text ? (
              <div>No content</div>
            ) : (
              <>
                {currentScenarioThemeContent?.title && (
                  <div>
                    <h2>{currentScenarioThemeContent.title}</h2>
                  </div>
                )}

                <div>
                  {currentScenarioThemeContent?.text && (
                    <p
                      className={
                        currentScenarioThemeContent?.text?.length > 300
                          ? "font-small"
                          : ""
                      }
                      dangerouslySetInnerHTML={{
                        __html: currentScenarioThemeContent?.text,
                      }}
                    ></p>
                  )}
                </div>
              </>
            )}

            {currentScenarioThemeContent?.image ? (
              <div className="image-wrapper">
                <img
                  src={`/content/${currentScenarioThemeContent.image}`}
                  alt=""
                />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};
