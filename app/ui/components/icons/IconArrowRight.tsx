import * as React from "react";
import { SVGProps } from "react";

export const IconArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={13}
    fill="none"
    {...props}
  >
    <path
      stroke="#333"
      strokeLinecap="square"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="m2 11.5 5-5-5-5"
    />
  </svg>
);
