import { TextField } from "@/shared/ui/text-field/textfield";
import classes from "./login.module.scss";
import { Button } from "@/shared/ui/button/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/entities/auth/model/store";
import { Select } from "@/shared/ui/select/select";
import supabase from "@/shared/supabase";

const EMAIL_SALT = "@gmail.com";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth, signIn } = useAuthStore();

  const [usersList, setUsersList] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (!data || error) {
        console.error("Error when getting data:", error);
        return;
      }

      const formattedList = data
        .filter((profile) => !profile.is_service_account)
        .map((profile) => ({
          label: profile.username ?? "",
          value: `${profile.username}${EMAIL_SALT}`.toLowerCase(),
        }));

      setUsersList(formattedList);

      setSelectedUser(formattedList[0].value);
    };
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    if (!selectedUser || !pin) return;

    setLoading(true);
    setError("");

    const success = await signIn(selectedUser, pin);

    if (success) {
      navigate("/");
    } else {
      setError("Неверный пин-код");
    }
    setLoading(false);
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>Логин</p>

      <div className={classes.form}>
        {selectedUser && usersList && (
          <Select
            label="Кто ты?"
            placeholder="Выбери себя"
            options={usersList}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.currentTarget.value)}
          />
        )}
        <TextField
          label="Пин-код"
          placeholder="1234"
          value={pin}
          onChange={(e) => setPin(e.currentTarget.value)}
          error={error}
        />
        <Button
          className={classes.button}
          onClick={handleLogin}
          isLoading={loading}
          disabled={!selectedUser || !pin}
        >
          Войти
        </Button>
      </div>
    </div>
  );
};
