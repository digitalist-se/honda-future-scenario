import "./MegaLoadingButton.css";

interface MegaLoadingButtonProps {
  isLoading: boolean;
  loadingPercent: number;
  isLoadingText: string;
  loadingCompleteText: string;
  handleClick: () => void;
}

export const MegaLoadingButton = ({
  isLoading,
  loadingPercent = 0,
  isLoadingText,
  loadingCompleteText,
  handleClick,
}: MegaLoadingButtonProps) => {
  return (
    <button
      className="mega-loading-button"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? isLoadingText : loadingCompleteText}

      <span className="loading">
        <span className="bar" style={{ width: `${loadingPercent}%` }} />
      </span>
    </button>
  );
};
