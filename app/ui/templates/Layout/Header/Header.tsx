import "./Header.css";
import Link from "next/link";
import { IconArrowRight } from "@/ui/atoms/icons/IconArrowRight";
import { HeaderClient } from "./HeaderClient";

interface HeaderProps {
  lang: string;
  currentPage: string;
}

export const Header = ({ lang, currentPage }: HeaderProps) => {
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
            <Link href={`/${lang}`}>Project 2035</Link>
          </li>
          <li
            className={
              "menu-item" + (currentPage === "about" ? " is-active" : "")
            }
          >
            <Link href={`/${lang}/about`}>About this project</Link>
          </li>
          <li
            className={
              "menu-item" + (currentPage === "contact" ? " is-active" : "")
            }
          >
            <Link href={`/${lang}/contact`}>Contact</Link>
          </li>

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
      </header>
      <HeaderClient />
    </>
  );
};
