import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./admin.module.scss";
import type { IconType } from "react-icons";
import { MdGroupAdd } from "react-icons/md";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { GiTrophyCup } from "react-icons/gi";
import { Navigate } from "react-router";
import { useAuthStore } from "@/entities/auth/model/store";
import { isAdmin } from "@/shared/helpers/isAdmin";

export const AdminPage: React.FC = () => {
  const profile = useAuthStore((state) => state.profile);
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

  if (!isAdmin(profile?.role ?? "player")) return <Navigate to="/" />;

  return (
    <div className={classess.container}>
      {navLinks.map((navLink) => (
        <div className={classess.tile} key={navLink.label}>
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
