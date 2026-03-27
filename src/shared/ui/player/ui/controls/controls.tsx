import { usePlayerStore } from "@/entities/player/model/store";

import { MdPlayArrow } from "react-icons/md";
import { MdOutlinePause } from "react-icons/md";
import styles from "./controls.module.scss";
import { IconButton } from "@/shared/ui/icon-button/icon-button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Range } from "@/shared/ui/range/range";
import { useMemo } from "react";
import dayjs from "dayjs";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { MdVolumeOff } from "react-icons/md";
import { MdVolumeUp } from "react-icons/md";

import duration from "dayjs/plugin/duration";
import { Badge } from "@/shared/ui/badge/badge";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";

dayjs.extend(duration);

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeekMouseDown: () => void;
  onSeekMouseUp: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  onSeekChange: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  played: number;
  duration: number;
  isFullScreen: boolean;
  toggleFullscreen: () => void;
}

const timeFormat = "mm:ss";

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSeekMouseDown,
  onSeekMouseUp,
  onSeekChange,
  played,
  duration,
  isFullScreen,
  toggleFullscreen,
}) => {
  const {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    isSpoilerProof,
    setIsSpoilerProof,
  } = usePlayerStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleSpoilerProof = () => {
    setIsSpoilerProof();
  };

  const playedSeconds = useMemo(
    () => dayjs.duration(played * duration, "seconds").format(timeFormat),
    [played, duration],
  );

  const durationSeconds = useMemo(
    () => dayjs.duration(duration, "seconds").format(timeFormat),
    [duration],
  );

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <Range
          min={0}
          max={0.99999999999}
          value={played}
          step="any"
          onMouseDown={onSeekMouseDown}
          onChange={onSeekChange}
          onMouseUp={onSeekMouseUp}
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.leftControls}>
          <Tooltip
            label={isPlaying ? "Пазуа" : "Воспроизведение"}
            position="right"
          >
            <IconButton
              onClick={onTogglePlay}
              icon={isPlaying ? <MdOutlinePause /> : <MdPlayArrow />}
            />
          </Tooltip>
          <div className={styles.volumeGroup}>
            <div className={styles.volumeButton}>
              <IconButton
                icon={
                  isMuted || volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />
                }
                onClick={toggleMute}
              />
            </div>

            <Range
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </div>
          <Badge>
            {playedSeconds} / {durationSeconds}
          </Badge>
        </div>

        <div className={styles.rightControls}>
          <Tooltip label="Спойлер режим">
            <IconButton
              icon={isSpoilerProof ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={toggleSpoilerProof}
            />
          </Tooltip>
          <Tooltip label="Полноэкранный режим" position="left">
            <IconButton
              icon={isFullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
              onClick={toggleFullscreen}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
