import * as React from "react";
import { SVGProps } from "react";

export const IconArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={15}
    fill="none"
    stroke="#333"
    {...props}
  >
    <path
      strokeLinecap="square"
      strokeMiterlimit={10}
      strokeWidth={3}
      d="m3 2.5 10 10 10-10"
    />
  </svg>
);
