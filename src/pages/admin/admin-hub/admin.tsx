import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./admin.module.scss";
import type { IconType } from "react-icons";
import { MdGroupAdd } from "react-icons/md";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { GiTrophyCup } from "react-icons/gi";
import { Navigate } from "react-router";
import { useAuthStore } from "@/entities/auth/model";
import { isAdmin } from "@/shared/helpers/isAdmin";

export const AdminPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
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
    {
      icon: GiTrophyCup,
      label: "Статистика",
      link: "openings-stats",
    },
  ];

  if (!isAdmin(user?.role ?? "player")) return <Navigate to="/" />;

  return (
    <div className={classess.container}>
      {navLinks.map((navLink) => (
        <div className={classess.tile}>
          <NavTile
            variant="secondary"
            to={navLink.link}
            icon={<navLink.icon />}
            label={navLink.label}
          />
        </div>
      ))}
    </div>
  );
};
