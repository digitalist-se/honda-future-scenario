interface SliderProps {
  labelMin: string;
  labelMax: string;
  defaultValue: string;
}

export const Slider = ({ labelMin, labelMax, defaultValue }: SliderProps) => {
  return (
    <div className="slider-wrapper">
      <div className="slider-labels-wrapper">
        <div className="slider-label-min">{labelMin}</div>
        <div className="slider-label-max">{labelMax}</div>
      </div>

      <input
        type="range"
        min="1"
        max="12"
        defaultValue={defaultValue}
        className="slider"
      />
    </div>
  );
};
