export type SliderType = {
  id: string;
  group: string;
  label_left: string;
  label_right: string;
};

export type SlidersDataType = Record<string, SliderType[]>;
