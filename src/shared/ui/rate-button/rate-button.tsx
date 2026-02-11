import clsx from "clsx";
import classess from "./rate-button.module.scss";

interface Props {
  value: string | number;
  onClick: (value: string | number) => void;
  isActive: boolean;
  size?: "md" | "xl";
}

export const RateButton: React.FC<Props> = ({
  value,
  isActive,
  size = "md",
  onClick,
}) => {
  const onClickHandler = () => {
    onClick(value);
  };

  return (
    <button
      className={clsx(
        classess.container,
        {
          [classess.active]: isActive,
        },
        classess[size],
      )}
      onClick={onClickHandler}
    >
      {value}
    </button>
  );
};
