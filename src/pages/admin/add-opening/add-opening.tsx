import { useState } from "react";
import classes from "./add-opening.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import { AnimeSelector } from "@/widgets/anime/anime-selector/anime-selector";
import { ArtistSelector } from "@/widgets/artist/artist-selector/artist-selector";
import { useOpeningsStore } from "@/entities/openings/model/store";

export const AddOpeningPage = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [openingNumber, setOpeningNumber] = useState<number | string>(1);
  const [seasonNumber, setSeasonNumber] = useState<number | string>(1);

  const [animeId, setAnimeId] = useState<string | null>(null);
  const [artistIds, setArtistIds] = useState<string[] | null>(null);

  const { addOpening } = useOpeningsStore();

  const handleSave = async () => {
    if (!url || !title || !animeId) {
      console.error("Нужна ссылка и название!");
      return;
    }

    const formattedOpeningNumber = Number(openingNumber);
    if (Number.isNaN(formattedOpeningNumber)) return;

    const formatedSeasonNumber = Number(seasonNumber);
    if (Number.isNaN(formatedSeasonNumber)) return;
    if (!artistIds || (artistIds && artistIds.length === 0)) return;

    try {
      await addOpening({
        url,
        title,
        animeId,
        openingNum: formattedOpeningNumber,
        seasonNum: formatedSeasonNumber,
        artistIds,
      });

      setUrl("");
      setTitle("");
      setOpeningNumber(1);
      setAnimeId(null);
      setArtistIds(null);
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

        <AnimeSelector onSelect={(id) => setAnimeId(id)} />

        <TextField
          label="Номер сезона"
          placeholder="1,2,3..."
          value={seasonNumber}
          onChange={(e) => setSeasonNumber(e.currentTarget.value)}
        />

        <TextField
          label="Номер опенинга"
          placeholder="1,2,3..."
          value={openingNumber}
          onChange={(e) => setOpeningNumber(e.currentTarget.value)}
        />

        <TextField
          label="Название трека"
          placeholder="KICK BACK"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <ArtistSelector onSelect={setArtistIds} />

        <Button onClick={handleSave}>Сохранить в Базу</Button>
      </div>
    </div>
  );
};
