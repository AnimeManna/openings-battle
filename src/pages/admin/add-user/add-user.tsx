import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import classes from "./add-user.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import type { Role, User } from "@/entities/auth/types";
import { roles } from "@/entities/auth/const";
import { Select } from "@/shared/ui/select/select";
import { db } from "@/shared/firebase";
import { APP_CONFIG } from "@/shared/config";

export const AddUserPage: React.FC = () => {
  const [login, setLogin] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [role, setRole] = useState<Role>(roles.player as Role);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const rolesOptions = [
    { value: roles.player, label: "Игрок (Player)" },
    { value: roles.judge, label: "Судья (Judge)" },
    { value: roles.admin, label: "Админ (Admin)" },
  ];

  const handleSave = async () => {
    try {
      const user: User = {
        id: login,
        displayName: login,
        pin,
        role,
        protectionBudget: APP_CONFIG.DEFAULT_PROTECTION_BUDGET,
      };
      await setDoc(doc(db, "users", login), user);

      setStatus("success");
      setLogin("");
      setPin("");
      setRole(roles.player as Role);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>Добавить юзера</p>

      <div className={classes.form}>
        <TextField
          label="Логин"
          placeholder="Игрок"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
        />
        <TextField
          label="Пин-код"
          placeholder="1234"
          value={pin}
          onChange={(e) => setPin(e.currentTarget.value)}
        />
        <Select
          label="Роль"
          placeholder="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          options={rolesOptions}
        />

        <Button
          onClick={handleSave}
          className={classes.button}
          color={status === "success" ? "green" : "blue"}
        >
          {status === "success" ? "Success" : "Сохранить в Базу"}
        </Button>
      </div>
    </div>
  );
};
