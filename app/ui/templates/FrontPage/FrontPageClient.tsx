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
      regionIslandElement.style.width = "50%";
      regionSlidersElement.style.width = "50%";
    };
    const handleMouseLeaveRegionSliders = () => {
      regionIslandElement.style.width = "";
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
    const islandElement = document.querySelector(
      ".island:not(.zoomed-in-clone)"
    ) as HTMLElement;
    const tilesElement = document.querySelector(".tiles") as HTMLElement;
    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((el) => {
      const tileElement = el as HTMLElement;
      // console.log(tileElement);

      tileElement.addEventListener("click", (e) => {
        const islandRect = islandElement.getBoundingClientRect();
        const currentTileElement = e.currentTarget as HTMLElement;
        const tileRect = currentTileElement.getBoundingClientRect();
        const tilesRect = tilesElement.getBoundingClientRect();
        console.log("islandRect", islandRect);
        console.log("tileRect", tileRect);
        console.log("tilesRect", tilesRect);

        // currentTileElement.classList.add("is-active");
        // tilesElement.style.left = "-52%";
        // tilesElement.style.top = "50%";
        // tilesElement.style.scale = "1.4";
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
