"use client";

import { useEffect } from "react";
import "./Header.css";
import Link from "next/link";
import { IconArrowRight } from "@/ui/atoms/icons";

interface HeaderProps {
  lang: string;
  currentPage: string;
}

export const Header = ({ lang, currentPage }: HeaderProps) => {
  useEffect(() => {
    const langSwitcherElement = document.querySelector(
      ".lang-switcher"
    ) as HTMLElement;

    if (!langSwitcherElement) return;

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
      if (!langSwitcherElement) return;

      langSwitcherElement.removeEventListener("click", handlelangSwitcherClick);
    };
  }, []);

  return (
    <>
      <header className="page-header">
        <ul className="main-menu">
          <li
            className={
              "menu-item menu-item-front" +
              (currentPage === "front" ? " is-active" : "")
            }
          >
            <Link href={`/${lang}`}>FUTEUR 35</Link>
          </li>

          <li
            className={
              "menu-item" + (currentPage === "about" ? " is-active" : "")
            }
          >
            <Link href={`/${lang}/about`}>About this project</Link>
          </li>

          {/* <li
            className={
              "menu-item" + (currentPage === "contact" ? " is-active" : "")
            }
          >
            <Link href={`/${lang}/contact`}>Contact</Link>
          </li> */}

          <li className="">
            <ul className={"lang-switcher"}>
              <li className="is-active">
                <span>{lang}</span>
              </li>
              <li>
                {lang === "en" ? (
                  <Link href={`/jp`}>JP</Link>
                ) : (
                  <Link href={`/en`}>EN</Link>
                )}
              </li>

              <IconArrowRight className="icon-arrow" />
            </ul>
          </li>
        </ul>

        <div className="header-border" />
      </header>
    </>
  );
};
