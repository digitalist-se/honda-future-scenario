import "./MegaLoadingButton.css";

interface MegaLoadingButtonProps {
  isLoading: boolean;
  loadingPercent: number;
  isLoadingText: string;
  loadingCompleteText: string;
}

export const MegaLoadingButton = ({
  isLoading,
  loadingPercent = 0,
  isLoadingText,
  loadingCompleteText,
}: MegaLoadingButtonProps) => {
  return (
    <button className="mega-loading-button" disabled={isLoading}>
      {isLoading ? isLoadingText : loadingCompleteText}

      <span className="loading">
        <span className="bar" style={{ width: `${loadingPercent}%` }} />
      </span>
    </button>
  );
};
