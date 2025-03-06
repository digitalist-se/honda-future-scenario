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
  text?: string;
  image?: string;
};
