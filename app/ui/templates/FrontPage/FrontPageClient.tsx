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

    // Set Front Page Wrapper height
    const page_header_height = pageHeaderElement.clientHeight;
    const page_wrapper_height = height - page_header_height;
    frontPageWrapperElement.style.height = `${page_wrapper_height}px`;

    // Set Sliders container height based on page height
    const regionSlidersInnerElement: HTMLElement = document.querySelector(
      ".region-sliders-inner"
    )!;
    const regionSlidersContentElement: HTMLElement = document.querySelector(
      ".region-sliders-content"
    )!;
    if (regionSlidersContentElement.clientHeight > page_wrapper_height) {
      regionSlidersInnerElement.style.height = `${page_wrapper_height}px`;
    } else {
      regionSlidersInnerElement.style.height = "auto";
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
