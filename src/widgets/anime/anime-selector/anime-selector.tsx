import { useFilteredAnime } from "@/entities/anime/hooks/useFilteredAnime";
import classess from "./anime-selector.module.scss";
import { AutoComplete } from "@/shared/ui/autocomplete/autocomplete";
import { Button } from "@/shared/ui/button/button";
import { CreateAnime } from "@/features/anime/create-anime/create-anime";
import { useState } from "react";
import { Accordion } from "@/shared/ui/accordion/accordion";

interface AnimeSelectorProps {
  onSelect: (id: string) => void;
}

type Mode = "search" | "creating" | "locked";

export const AnimeSelector: React.FC<AnimeSelectorProps> = ({ onSelect }) => {
  const { animeSearch, setAnimeSearch, filteredAnimeOptions } =
    useFilteredAnime();

  const [mode, setMode] = useState<Mode>("search");

  const onCreateAnimeClick = () => {
    setMode("creating");
  };

  const onCancelCreateAnime = () => {
    setMode("search");
  };

  const onCreatedAnime = (id: string, title: string) => {
    setAnimeSearch(title);
    onSelect(id);
    setMode("locked");
  };

  return (
    <div className={classess.container}>
      <AutoComplete
        label="Название аниме"
        placeholder="Chainsaw Man"
        disabled={mode !== "search"}
        value={animeSearch}
        onSelect={onCreatedAnime}
        onChange={(e) => setAnimeSearch(e.currentTarget.value)}
        options={filteredAnimeOptions}
        noOptionsContent={
          <Button variant="secondary" fullWidth onClick={onCreateAnimeClick}>
            + Добавить аниме
          </Button>
        }
      />
      {mode !== "search" && (
        <Accordion
          isOpenByDefault
          isKeepClosed={mode === "locked"}
          header={
            <div className={classess.header}>
              <p className={classess.title}>{animeSearch}</p>
              <div className={classess.status}>
                {mode === "creating" ? "Creating..." : "Success"}
              </div>
            </div>
          }
        >
          <div className={classess.form}>
            <CreateAnime
              initialTitle={animeSearch}
              onSuccess={onCreatedAnime}
              onCancel={onCancelCreateAnime}
            />
          </div>
        </Accordion>
      )}
    </div>
  );
};
