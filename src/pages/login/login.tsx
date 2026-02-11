import { TextField } from "@/shared/ui/text-field/textfield";
import classes from "./login.module.scss";
import { Button } from "@/shared/ui/button/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/entities/auth/model";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/shared/firebase";
import { Select } from "@/shared/ui/select/select";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  const [usersList, setUsersList] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().displayName,
      }));
      setUsersList(list);

      setSelectedUser(list[0].value);
    };
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    if (!selectedUser || !pin) return;

    setLoading(true);
    setError("");

    const success = await login(selectedUser, pin);

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
