import { MdHome } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import classess from "./footer.module.scss";
import { IconButton } from "@/shared/ui/icon-button/icon-button";
import { useNavigate } from "react-router";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";
import { useAuthStore } from "@/entities/auth/model/store";
import { isAdmin } from "@/shared/helpers/isAdmin";
import type { NavigationButton } from "@/shared/types/nav";
import { GoSignOut } from "react-icons/go";
import { useState, type MouseEvent } from "react";
import { Menu } from "@/shared/ui/menu/menu";
import { MdMenu } from "react-icons/md";
import type { IconType } from "react-icons";
import { MdArrowBack } from "react-icons/md";

type MenuOption = {
  key: string;
  icon: IconType;
  label: string;
  onClick: () => void;
};

export const MainFooter: React.FC = () => {
  const navigate = useNavigate();

  const { profile, signOut } = useAuthStore();

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

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(menuAnchor);

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const menuOptions: MenuOption[] = [
    ...(profile && profile.role && isAdmin(profile.role)
      ? [
          {
            key: "admin",
            icon: MdAdminPanelSettings,
            label: "Админка",
            onClick: () => {
              navigateTo("/admin");
            },
          },
        ]
      : []),
    {
      key: "sign-out",
      icon: GoSignOut,
      label: "Выйти",
      onClick: () => {
        signOut();
      },
    },
  ];

  return (
    <div className={classess.container}>
      <div className={classess.left}>
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          icon={<MdArrowBack />}
          size="lg"
        />
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
        <IconButton onClick={openMenu} icon={<MdMenu />} size="lg" />
        <Menu open={open} anchorEl={menuAnchor} handleClose={closeMenu}>
          {menuOptions.map((menuOption) => (
            <div
              className={classess["menu-item"]}
              key={menuOption.key}
              onClick={() => {
                menuOption.onClick();
                closeMenu();
              }}
            >
              <menuOption.icon className={classess.icon} />
              <p className={classess["menu-item__label"]}>{menuOption.label}</p>
            </div>
          ))}
        </Menu>
      </div>
    </div>
  );
};
