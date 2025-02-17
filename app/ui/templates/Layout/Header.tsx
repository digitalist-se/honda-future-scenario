import "./Header.css";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="page-header">
      <ul className="main-menu">
        <li>
          <Link href="/" className="active">
            Project 2035
          </Link>
        </li>
        <li>
          <Link href="/">About this project</Link>
        </li>
        <li>
          <Link href="/">Contact</Link>
        </li>
      </ul>
    </header>
  );
};
