import { useState } from "react";
import classes from "./add-opening.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { getYoutubeId } from "@/shared/helpers/getYoutubeId";

export const AddOpeningPage = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [anime, setAnime] = useState("");
  const [startTime, setStartTime] = useState<number | string>(0);
  const [orderNumber, setOrderNumber] = useState<number | string>(1);

  const handleSave = async () => {
    const id = getYoutubeId(url);
    if (!id || !title) {
      alert("Нужна ссылка и название!");
      return;
    }

    try {
      // const opening: Opening = {
      //   id: id,
      //   youtubeUrl: url,
      //   startTime: Number(startTime),
      //   orderNumber: Number(orderNumber),
      //   title: title,
      //   anime: anime,
      //   createdAt: Date.now().toString(),
      //   isProtected: false,
      //   stats: {
      //     scoreSum: 0,
      //     votesCount: 0,
      //     avgScore: 0,
      //   },
      // };

      setUrl("");
      setTitle("");
      setAnime("");
      setOrderNumber(1);
      setStartTime(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>Добавить Опенинг</p>

      <div className={classes.form}>
        <TextField
          label="Ссылка"
          placeholder="https://youtu.be/..."
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />

        {getYoutubeId(url) && (
          <div className={classes.preview}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${getYoutubeId(url)}`}
              title="Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <TextField
          label="Название трека"
          placeholder="KICK BACK"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <TextField
          label="Название аниме"
          placeholder="Chainsaw Man"
          value={anime}
          onChange={(e) => setAnime(e.currentTarget.value)}
        />

        <TextField
          label="Номер опенинга"
          placeholder="1,2,3..."
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.currentTarget.value)}
        />

        <TextField
          label="Старт (секунды)"
          value={startTime}
          onChange={(e) => setStartTime(e.currentTarget.value)}
        />

        <Button onClick={handleSave}>Сохранить в Базу</Button>
      </div>
    </div>
  );
};
