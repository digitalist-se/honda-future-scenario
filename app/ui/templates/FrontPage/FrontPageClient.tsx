"use client";
import { useEffect } from "react";
import { useWindowSize } from "@/lib/useWindowSize";

export const FrontPageClient = () => {
  const { width, height } = useWindowSize();

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

    // Set Front Page Wrapper height
    const page_header_height = pageHeaderElement.clientHeight;
    const page_wrapper_height = height - page_header_height;
    frontPageWrapperElement.style.height = `${page_wrapper_height}px`;

    // Set Sliders container height based on page height
    if (regionSlidersContentElement.clientHeight > page_wrapper_height) {
      regionSlidersInnerElement.style.height = `${page_wrapper_height}px`;
      regionSlidersScrollWrapperElement.style.display = "block";
    } else {
      regionSlidersInnerElement.style.height = "auto";
      regionSlidersScrollWrapperElement.style.display = "flex";
    }

    // Resize regions on mouse moves
    const handleMouseEnterRegionSliders = () => {
      islandElement.style.width = "50%";
      regionSlidersElement.style.width = "50%";
    };
    const handleMouseLeaveRegionSliders = () => {
      islandElement.style.width = "";
      regionSlidersElement.style.width = "";
    };

    if (regionIslandElement && regionSlidersElement) {
      // Expand slider region on hover on small desktop sizes
      if (width >= 1024 && width < 1440) {
        regionSlidersElement.addEventListener(
          "mouseenter",
          handleMouseEnterRegionSliders
        );
        regionSlidersElement.addEventListener(
          "mouseleave",
          handleMouseLeaveRegionSliders
        );
      }
    }

    // Tiles
    // Apply display flex to center tiles horizontally
    if (islandElement.clientWidth - tilesElement.clientWidth) {
      islandElement.style.display = "flex";
      islandZoomedInCloneElement.style.display = "flex";
    } else {
      islandElement.style.display = "block";
      islandZoomedInCloneElement.style.display = "block";
    }

    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((el) => {
      const tileElement = el as HTMLElement;

      tileElement.addEventListener("click", (e) => {
        //
        const selectedTileElement = e.currentTarget as HTMLElement;
        if (selectedTileElement.classList.contains("zoomed-in")) return;

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

        tilesElement.style.left = `${leftOffset}px`;
        tilesElement.style.top = `${topOffset}px`;
        tilesElement.style.scale = "1.4";
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

        tilesElement.style.left = ``;
        tilesElement.style.top = ``;
        tilesElement.style.scale = "";
      });
    });

    return () => {
      regionSlidersElement.removeEventListener(
        "mouseenter",
        handleMouseEnterRegionSliders
      );
      regionSlidersElement.removeEventListener(
        "mouseleave",
        handleMouseLeaveRegionSliders
      );
    };
  }, [width, height]);

  return <></>;
};
