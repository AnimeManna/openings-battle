import { useState } from "react";
import classes from "./add-user.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { roles } from "@/entities/auth/model/const";
import { Select } from "@/shared/ui/select/select";
import type { Role } from "@/entities/auth/model/types";
import { useAuthStore } from "@/entities/auth/model/store";

export const AddUserPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Role>(roles.player as Role);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const addUser = useAuthStore((state) => state.signUp);

  const rolesOptions = [
    { value: roles.player, label: "Игрок (Player)" },
    { value: roles.judge, label: "Судья (Judge)" },
    { value: roles.admin, label: "Админ (Admin)" },
  ];

  const handleSave = async () => {
    try {
      await addUser(email, password, login, role);
      setStatus("success");
      setEmail("");
      setLogin("");
      setPassword("");
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
          label="Email"
          placeholder="test@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextField
          label="Логин"
          placeholder="Игрок"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
        />
        <TextField
          label="Пароль"
          placeholder="1234"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
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
