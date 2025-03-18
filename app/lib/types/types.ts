export type SliderType = {
  id: string;
  group: string;
  label_left: string;
  label_right: string;
};

export type SlidersDataType = Record<string, SliderType[]>;

export type ScenarioType = {
  id: string;
  name: string;
};

export type ThemeType = {
  id: string;
  name: string;
};

export type ThemesDataType = Record<string, ThemeType>;

export type ScenarioThemeContent = {
  scenario_id: string;
  theme_id: string;
  top_title?: string;
  top_subtitle?: string;
  title?: string;
  text?: string;
  image?: string;
};

export type TileDataType = {
  id: string;
  theme: string;
  [key: string]: string;
};

export type TileImageType = {
  tile_id: string;
  scenario_id: string;
  image_url: string;
  image?: HTMLImageElement;
};
