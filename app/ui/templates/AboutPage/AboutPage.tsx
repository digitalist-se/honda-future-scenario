import "./AboutPage.css";
import { ContactForm } from "./ContactForm";

interface AboutPageProps {
  isActivePage: boolean;
}

export const AboutPage = ({ isActivePage }: AboutPageProps) => {
  return (
    <main
      className={[
        "about-page-wrapper",
        isActivePage ? "is-active-page" : null,
      ].join(" ")}
    >
      <div className="container">
        <div className="island island-1">
          <img src="/about-island-1.svg" alt="Floating island 1" />
        </div>

        <div className="content-wrapper">
          <h1>
            FUTEUR 2035 is a project designed to get us thinking – what might
            the world look like in 2035 and what influences it?
          </h1>

          <p>
            Looking across the areas of PESTEL (Political, Economic, Societal,
            Environmental and Legal) the activity explores the impact of growing
            trends on society as a whole.
          </p>
          <p>
            Designed to be used to spark conversations when thinking about the
            future – and what challenges might be faced – in order to generate
            ideas and explore opportunities.
          </p>
          <p>
            The activity is growing all the time, so please do check back to see
            more scenarios, more options and even the chance to build your own
            version of the future.
          </p>
          <p>
            Want to know more or be involved with the activity as it grows?
            Contact us here.
          </p>

          <ContactForm />
        </div>

        <div className="island island-2">
          <img src="/about-island-2.svg" alt="Floating island 1" />
        </div>
      </div>
    </main>
  );
};
