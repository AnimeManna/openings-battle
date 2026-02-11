import { Link } from "react-router";
import classess from "./nav-corner.module.scss";
import { MdChevronRight } from "react-icons/md";
import { MdChevronLeft } from "react-icons/md";

interface NavCornerProps {
  link: string;
  direction?: "left" | "right";
}

export const NavCorner: React.FC<NavCornerProps> = ({
  link,
  direction = "right",
}) => {
  return (
    <Link to={link} className={classess.link}>
      {direction === "right" ? (
        <MdChevronRight className={classess.icon} />
      ) : (
        <MdChevronLeft className={classess.icon} />
      )}
    </Link>
  );
};
