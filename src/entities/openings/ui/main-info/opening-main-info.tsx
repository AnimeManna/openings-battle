import { useMemo } from "react";
import { useOpeningsStore } from "../../model/store";
import { CustomPlayer } from "@/shared/ui/player/ui/custom-player/custom-player";
import classess from "./opening-main-info.module.scss";

interface OpeningMainInfoProps {
  openingId: string;
}

export const OpeningMainInfo: React.FC<OpeningMainInfoProps> = ({
  openingId,
}) => {
  const { openingsMap } = useOpeningsStore();

  const opening = useMemo(
    () => openingsMap.get(openingId),
    [openingId, openingsMap],
  );

  return opening ? (
    <div className={classess.container}>
      <p className={classess.title}>{opening.title}</p>
      <CustomPlayer
        videoUrl={opening.videoUrl}
        backupVideoUrl={opening.backUpVideoUrl}
      />

      <div className={classess.infoGrid}>
        <div className={classess.label}>Аниме</div>
        <div className={classess.value}>
          {opening.anime?.englishTitle} / {opening.anime?.japaneseTitle}
        </div>

        <div className={classess.label}>Сезон</div>
        <div className={classess.value}>{opening.seasonNum} сезон</div>

        <div className={classess.label}>Номер Опенинга</div>
        <div className={classess.value}>{opening.openingNum}</div>
      </div>
    </div>
  ) : null;
};
