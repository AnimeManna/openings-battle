import { MdHome } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import classess from "./footer.module.scss";
import { IconButton } from "@/shared/ui/icon-button/icon-button";
import { useNavigate } from "react-router";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";
import { useAuthStore } from "@/entities/auth/model";
import { isAdmin } from "@/shared/helpers/isAdmin";
import type { NavigationButton } from "@/shared/types/nav";
import { GoSignOut } from "react-icons/go";

export const MainFooter: React.FC = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const navButtons: NavigationButton[] = [
    {
      icon: MdHome,
      label: "Домашняя",
      link: "/",
    },
  ];

  const navigateTo = (link: string) => {
    navigate(link);
  };

  return (
    <div className={classess.container}>
      <div className={classess.left}>
        {user && isAdmin(user.role) && (
          <div
            className={classess.item}
            onClick={() => {
              navigateTo("/admin");
            }}
          >
            <Tooltip label="Выйти">
              <IconButton icon={<MdAdminPanelSettings />} size="lg" />
            </Tooltip>
          </div>
        )}
      </div>
      <ul className={classess.list}>
        {navButtons.map((navButton) => (
          <li
            key={navButton.label}
            className={classess.item}
            onClick={() => {
              navigateTo(navButton.link);
            }}
          >
            <Tooltip label={navButton.label}>
              <IconButton icon={<navButton.icon />} size="lg" />
            </Tooltip>
          </li>
        ))}
      </ul>

      <div className={classess.right}>
        <div
          className={classess.item}
          onClick={() => {
            logout();
          }}
        >
          <Tooltip label="Выйти">
            <IconButton icon={<GoSignOut />} size="lg" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
