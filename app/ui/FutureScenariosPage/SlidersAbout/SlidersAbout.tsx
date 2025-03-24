import "./SlidersAbout.css";

interface SlidersAboutProps {
  lang: string;
  navigateToPage: (page: string) => void;
}

export const SlidersAbout = ({ lang, navigateToPage }: SlidersAboutProps) => {
  return (
    <div className="sliders-about">
      Do you want to know more about those sliders?{" "}
      <a
        href={`/${lang}/about`}
        onClick={(e) => {
          e.preventDefault();
          navigateToPage("about");
        }}
      >
        <strong>Find out here.</strong>
      </a>
    </div>
  );
};
