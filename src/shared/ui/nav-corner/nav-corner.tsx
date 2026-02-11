import { NavLink } from "react-router";
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
    <div className={classess.link}>
      <NavLink to={link}>
        {direction === "right" ? (
          <MdChevronRight className={classess.icon} />
        ) : (
          <MdChevronLeft className={classess.icon} />
        )}
      </NavLink>
    </div>
  );
};
