import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./admin.module.scss";
import type { IconType } from "react-icons";
import { MdGroupAdd } from "react-icons/md";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";

export const AdminPage: React.FC = () => {
  interface NavigationButton {
    icon: IconType;
    label: string;
    link: string;
  }

  const navLinks: NavigationButton[] = [
    {
      icon: MdGroupAdd,
      label: "Добавить игрока",
      link: "add-user",
    },
    {
      icon: AiOutlineVideoCameraAdd,
      label: "Добавить опенинг",
      link: "add-opening",
    },
  ];

  return (
    <div className={classess.container}>
      <ul className={classess.list}>
        {navLinks.map((navLink) => (
          <li className={classess.item}>
            <NavTile
              variant="secondary"
              to={navLink.link}
              icon={<navLink.icon />}
              label={navLink.label}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
