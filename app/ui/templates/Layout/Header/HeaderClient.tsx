"use client";
import { useEffect } from "react";

export const HeaderClient = () => {
  useEffect(() => {
    const langSwitcherElement = document.querySelector(
      ".lang-switcher"
    ) as HTMLElement;

    const handlelangSwitcherClick = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement;
      if (element.classList.contains("open")) {
        element.classList.remove("open");
      } else {
        element.classList.add("open");
      }
    };

    langSwitcherElement.addEventListener("click", handlelangSwitcherClick);

    return () => {
      langSwitcherElement.removeEventListener("click", handlelangSwitcherClick);
    };
  }, []);

  return <></>;
};
