"use client";

import { useEffect } from "react";
import "./Header.css";
import Link from "next/link";
import { IconArrowRight, IconMenu, IconClose } from "@/ui/atoms/icons";
import { useWindowSize } from "@/lib/useWindowSize";

interface HeaderProps {
  lang: string;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export const Header = ({ lang, currentPage, setCurrentPage }: HeaderProps) => {
  const { width } = useWindowSize();

  useEffect(() => {
    const langSwitcherElement = document.querySelector(
      ".lang-switcher"
    ) as HTMLElement;

    const handlelangSwitcherClick = () => {
      if (langSwitcherElement.classList.contains("open")) {
        langSwitcherElement.classList.remove("open");
      } else {
        langSwitcherElement.classList.add("open");
      }
    };

    if (langSwitcherElement) {
      langSwitcherElement.addEventListener("click", handlelangSwitcherClick);
    }

    return () => {
      if (langSwitcherElement) {
        langSwitcherElement.removeEventListener(
          "click",
          handlelangSwitcherClick
        );
      }
    };
  }, [width]);

  return (
    <>
      <header className="page-header">
        <button
          className="button-menu-togggle"
          onClick={() => {
            if (document.body.classList.contains("mobile-menu-open")) {
              document.body.classList.remove("mobile-menu-open");
            } else {
              document.body.classList.add("mobile-menu-open");
            }
          }}
        >
          <IconMenu className="icon-menu" />
          <IconClose className="icon-close" />
        </button>

        <div className="main-menu-wrapper">
          <ul className="main-menu">
            <li
              className={
                "menu-item menu-item-front" +
                (currentPage === "front" ? " is-active" : "")
              }
            >
              <a
                href={`/${lang}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.body.classList.remove("mobile-menu-open");
                  setCurrentPage("front");
                }}
              >
                FUTEUR 35
              </a>
            </li>

            <li
              className={
                "menu-item" + (currentPage === "about" ? " is-active" : "")
              }
            >
              <a
                href={`/${lang}/about`}
                onClick={(e) => {
                  e.preventDefault();
                  document.body.classList.remove("mobile-menu-open");
                  setCurrentPage("about");
                }}
              >
                About this project
              </a>
            </li>

            <li className="menu-item-language">
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
        </div>

        <div className="header-border" />
      </header>
    </>
  );
};
