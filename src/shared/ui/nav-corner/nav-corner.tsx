import { Link } from "react-router";
import classess from "./nav-corner.module.scss";
import { MdChevronRight } from "react-icons/md";
import { MdChevronLeft } from "react-icons/md";

interface NavCornerProps {
  link?: string;
  direction?: "left" | "right";
  onClick?: () => void;
}

export const NavCorner: React.FC<NavCornerProps> = ({
  link,
  direction = "right",
  onClick,
}) => {
  return (
    <Link to={link ?? ""} className={classess.link} onClick={onClick}>
      {direction === "right" ? (
        <MdChevronRight className={classess.icon} />
      ) : (
        <MdChevronLeft className={classess.icon} />
      )}
    </Link>
  );
};
