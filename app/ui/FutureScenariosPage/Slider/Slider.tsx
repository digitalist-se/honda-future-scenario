import { useEffect, useState, useRef } from "react";
import "./Slider.css";
import { ScenarioType } from "@/lib/types";

interface SliderProps {
  scenariosData: ScenarioType[];
  item_slider: any;
  currentScenario: ScenarioType;
  setCurrentScenario: (scenario: ScenarioType) => void;
}

type SnapPointType = {
  id: string;
  value: number;
};

export const Slider = ({
  scenariosData,
  item_slider,
  currentScenario,
  setCurrentScenario,
}: SliderProps) => {
  const sliderRef = useRef(null);

  const [sliderValue, setSliderValue] = useState(
    parseInt(item_slider[currentScenario.id], 10)
  );
  const [isDragged, setIsDragged] = useState(false);

  const snapPoints: SnapPointType[] = scenariosData
    .map((scenario) => {
      return { id: scenario.id, value: parseInt(item_slider[scenario.id], 10) };
    })
    .filter((snapPoint) => snapPoint?.value);

  const handleDrag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDragged(true);
    const value: number = parseInt(event.target.value, 10);
    setSliderValue(value);

    // Find the nearest snap point
    let closestPoint: undefined | SnapPointType = undefined;
    let closestDelta: undefined | number = undefined;
    for (const snapPoint of snapPoints) {
      const delta: number = Math.abs(value - snapPoint.value);
      if (!closestPoint && !closestDelta) {
        closestPoint = snapPoint;
        closestDelta = delta;
      } else {
        if (delta < closestDelta!) {
          closestPoint = snapPoint;
          closestDelta = delta;
        }
      }
    }

    // Update scenario
    if (closestPoint!.id !== currentScenario.id) {
      const newCurrentScenario: ScenarioType = scenariosData.find(
        (scenario) => scenario.id === closestPoint!.id
      )!;
      setCurrentScenario(newCurrentScenario);
    }
  };

  const handleRelease = () => {
    setIsDragged(false);
  };

  const animateSlider = (start: number, end: number, duration: number) => {
    const startTime = performance.now();

    const updateSlider = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is capped at 1

      // ease-out function: f(x) = 1 - (1 - x)^3 (cubic ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.round(start + (end - start) * easedProgress);

      const sliderElement: HTMLInputElement = sliderRef.current!;
      sliderElement.value = `${newValue}`;
      setSliderValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(updateSlider);
      }
    };

    requestAnimationFrame(updateSlider);
  };

  useEffect(() => {
    // Do not update if being dragged
    if (isDragged) return;

    // Animate slider handle on scenario/value change
    const newValue = parseInt(item_slider[currentScenario.id], 10);

    animateSlider(sliderValue, newValue, 300);
  }, [item_slider, currentScenario, isDragged]);

  return (
    <div className="slider-wrapper">
      <div className="slider-labels-wrapper">
        <div className="slider-label-min">{item_slider.label_left}</div>
        <div className="slider-label-max">{item_slider.label_right}</div>
      </div>

      <div className="slider-container">
        <div className="slider-element">
          <span className="progress" style={{ width: `${sliderValue}%` }} />

          {/* Render scenario sticky point markers */}
          {snapPoints.map((snapPoint, i) => {
            return (
              <span
                key={`snap-point-${i}`}
                className="sticky-point"
                style={{ left: `${snapPoint?.value}%` }}
              />
            );
          })}

          <input
            ref={sliderRef}
            type="range"
            min="1"
            max="100"
            className="slider"
            defaultValue={sliderValue}
            onChange={handleDrag}
            onMouseUp={handleRelease}
            onTouchEnd={handleRelease}
          />
        </div>
      </div>
    </div>
  );
};
