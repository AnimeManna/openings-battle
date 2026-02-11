import clsx from "clsx";
import classess from "./shield-button.module.scss";
import { RiShieldStarFill } from "react-icons/ri";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";

interface Props {
  onClick: () => void;
  isActive: boolean;
}

export const ShieldButton: React.FC<Props> = (props) => {
  const onClickHandler = () => {
    props.onClick();
  };

  return (
    <Tooltip label="Защитить">
      <button
        className={clsx(classess.container, {
          [classess.active]: props.isActive,
        })}
        onClick={onClickHandler}
      >
        <RiShieldStarFill />
      </button>
    </Tooltip>
  );
};
