import classess from "./artist-selector.module.scss";
import { AutoComplete } from "@/shared/ui/autocomplete/autocomplete";
import { Button } from "@/shared/ui/button/button";
import { useMemo, useState, useImperativeHandle, forwardRef } from "react";
import { Accordion } from "@/shared/ui/accordion/accordion";
import { useFilteredArtists } from "@/entities/artist/hooks/useFilteredArtists";
import { AddArtist } from "@/features/artist/add-artits/add-artits";
import { IconButton } from "@/shared/ui/icon-button/icon-button";
import { MdClose } from "react-icons/md";

export interface ArtistSelectorHandle {
  reset: () => void;
}

interface ArtistSelectorProps {
  onSelect: (ids: string[]) => void;
}

type Mode = "search" | "creating" | "locked";

type ArtistItem = {
  id: string | null;
  name: string;
  mode: Mode;
};

export const ArtistSelector = forwardRef<
  ArtistSelectorHandle,
  ArtistSelectorProps
>(({ onSelect }, ref) => {
  const { artistSearch, setArtistSearch, filtereArtistsOptions } =
    useFilteredArtists();

  const [artists, setArtists] = useState<ArtistItem[]>([]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setArtists([]);
      setArtistSearch("");
    },
  }));

  const notifyParent = (currentItems: ArtistItem[]) => {
    const ids = currentItems
      .filter((item) => item.id !== null)
      .map((item) => item.id as string);
    onSelect(ids);
  };

  const onStartCreating = () => {
    setArtists((prevState) => [
      ...prevState,
      { name: artistSearch, mode: "creating", id: null },
    ]);
    setArtistSearch("");
  };

  const onAddArtist = (id: string, name: string) => {
    const newItems: ArtistItem[] = artists.map((artist) =>
      artist.mode === "creating" ? { id, name, mode: "locked" } : artist,
    );
    setArtists(newItems);
    notifyParent(newItems);
  };

  const onSelectFromSearch = (id: string, name: string) => {
    if (artists.some((artist) => artist.id === id)) return;

    const newItems: ArtistItem[] = [...artists, { id, name, mode: "locked" }];
    setArtists(newItems);
    notifyParent(newItems);
    setArtistSearch("");
  };

  const onRemoveArtist = (name: string) => {
    const currentArtist = artists.find((artist) => artist.name === name);
    if (!currentArtist) return;

    const newArtists = artists.filter((artist) => artist.name !== name);
    setArtists(newArtists);
    notifyParent(newArtists);
  };

  const changeNameHandler = (value: string) => {
    setArtists((prevState) =>
      prevState.map((prevArtist) =>
        prevArtist.mode === "creating"
          ? { ...prevArtist, name: value }
          : prevArtist,
      ),
    );
  };

  const isDisabledSearch = useMemo(
    () => artists.some((artist) => artist.mode === "creating"),
    [artists],
  );

  const isShowList = useMemo(() => artists.length > 0, [artists]);

  return (
    <div className={classess.container}>
      <AutoComplete
        label="Исполните(ль/ли)"
        placeholder="Yui"
        disabled={isDisabledSearch}
        value={artistSearch}
        onSelect={onSelectFromSearch}
        onChange={(e) => setArtistSearch(e.currentTarget.value)}
        options={filtereArtistsOptions}
        noOptionsContent={
          <Button variant="secondary" fullWidth onClick={onStartCreating}>
            + Добавить исполнителя
          </Button>
        }
      />
      {isShowList && (
        <ul className="list">
          {artists.map(({ id, mode, name }, index) => (
            <li key={id || "creating-item" + index}>
              <Accordion
                isOpenByDefault
                isKeepClosed={mode === "locked"}
                header={
                  <div className={classess.header}>
                    <p className={classess.title}>{name}</p>
                    <div className={classess.status}>
                      <IconButton
                        icon={<MdClose />}
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemoveArtist(name);
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <div className={classess.form}>
                  <AddArtist
                    onChangeName={changeNameHandler}
                    initialName={name}
                    onSuccess={onAddArtist}
                    onCancel={() => onRemoveArtist(name)}
                  />
                </div>
              </Accordion>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
