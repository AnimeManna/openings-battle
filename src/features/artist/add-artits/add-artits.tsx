import { useState } from "react";
import classess from "./add-artis.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { useArtistStore } from "@/entities/artist/model/store";

interface AddArtistProps {
  initialName?: string;
  onChangeName: (value: string) => void;

  onSuccess?: (id: string, title: string) => void;
  onCancel?: () => void;
}

export const AddArtist: React.FC<AddArtistProps> = ({
  initialName,
  onChangeName,
  onSuccess,
  onCancel,
}) => {
  const { createArtist } = useArtistStore();

  const [name, setName] = useState<string>(initialName ?? "");

  const createHandler = async () => {
    if (!name.trim().length) {
      return;
    }

    const { data } = await createArtist({
      name,
    });

    if (data) {
      if (onSuccess) onSuccess(data.id, data.name);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setName(value);
    onChangeName(value);
  };

  return (
    <div className={classess.container}>
      <div className={classess.form}>
        <TextField
          label="Имя"
          placeholder="Yui"
          value={name}
          onChange={changeHandler}
        />
      </div>
      <div className={classess.actions}>
        <Button onClick={createHandler}>Создать</Button>
        <Button variant="secondary" onClick={onCancel}>
          Отменить
        </Button>
      </div>
    </div>
  );
};
