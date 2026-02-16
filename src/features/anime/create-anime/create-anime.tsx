import { useState } from "react";
import classess from "./create-anime.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { useAnimeStore } from "@/entities/anime/model/store";
interface CreateAnimeProps {
  initialTitle?: string;

  onSuccess?: (id: string, title: string) => void;
  onCancel?: () => void;
}

export const CreateAnime: React.FC<CreateAnimeProps> = ({
  initialTitle,
  onSuccess,
  onCancel,
}) => {
  const { createAnime } = useAnimeStore();

  const [englishTitle, setEnglishTitle] = useState<string>(initialTitle ?? "");
  const [japaneseTitle, setJapaneseTitle] = useState<string>("");
  const [russianTitle, setRussinaTitle] = useState<string>("");

  const createHandler = async () => {
    if (!englishTitle.trim().length) {
      return;
    }

    const { data } = await createAnime({
      english_title: englishTitle,
      japanese_title: japaneseTitle,
      russian_title: russianTitle,
    });

    if (data) {
      if (onSuccess) onSuccess(data.id, data.english_title);
    }
  };

  return (
    <div className={classess.container}>
      <div className={classess.form}>
        <TextField
          label="Английское название"
          placeholder="Naruto"
          value={englishTitle}
          onChange={(e) => setEnglishTitle(e.currentTarget.value)}
        />
        <TextField
          label="Японское название"
          placeholder="Naruto"
          value={japaneseTitle}
          onChange={(e) => setJapaneseTitle(e.currentTarget.value)}
        />
        <TextField
          label="Русское название"
          placeholder="Наруто"
          value={russianTitle}
          onChange={(e) => setRussinaTitle(e.currentTarget.value)}
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
