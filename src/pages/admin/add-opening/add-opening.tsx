import { useState } from "react";
import classes from "./add-opening.module.scss";
import { TextField } from "@/shared/ui/text-field/textfield";
import { Button } from "@/shared/ui/button/button";
import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import { AutoComplete } from "@/shared/ui/autocomplete/autocomplete";
import { useFilteredAnime } from "@/entities/anime/hooks/useFilteredAnime";
import { useFilteredArtists } from "@/entities/artist/hooks/useFilteredArtists";

export const AddOpeningPage = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [orderNumber, setOrderNumber] = useState<number | string>(1);
  const [seasonNumber, setSeasonNumber] = useState<number | string>(1);

  const { animeSearch, setAnimeSearch, filteredAnimeOptions } =
    useFilteredAnime();

  const { artistSearch, setArtistSearch, filtereArtistsOptions } =
    useFilteredArtists();

  const handleSave = async () => {
    const id = getYoutubeId(url);
    if (!id || !title) {
      alert("Нужна ссылка и название!");
      return;
    }

    try {
      setUrl("");
      setTitle("");
      setAnimeSearch("");
      setArtistSearch("");
      setOrderNumber(1);
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

        <AutoComplete
          label="Название аниме"
          placeholder="Chainsaw Man"
          value={animeSearch}
          onChange={(e) => setAnimeSearch(e.currentTarget.value)}
          options={filteredAnimeOptions}
        />

        <TextField
          label="Номер сезона"
          placeholder="1,2,3..."
          value={seasonNumber}
          onChange={(e) => setSeasonNumber(e.currentTarget.value)}
        />

        <TextField
          label="Номер опенинга"
          placeholder="1,2,3..."
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.currentTarget.value)}
        />

        <TextField
          label="Название трека"
          placeholder="KICK BACK"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <AutoComplete
          label="Исполните(ль/ли)"
          placeholder="Yui"
          value={artistSearch}
          onChange={(e) => setArtistSearch(e.currentTarget.value)}
          options={filtereArtistsOptions}
        />

        <Button onClick={handleSave}>Сохранить в Базу</Button>
      </div>
    </div>
  );
};
