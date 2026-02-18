import type { Opening } from "@/entities/openings/model/types";
import classesss from "./custom-player.module.scss";
import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import { PlayerControls } from "../controls/controls";
import { usePlayerStore } from "@/entities/player/model/store";
import { Switch } from "@/shared/ui/switch/switch";
import clsx from "clsx";

interface CustomPlayerProps {
  opening: Opening;
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ opening }) => {
  const [isVideoError, setIsVideoError] = useState<boolean>(false);
  const {
    volume,
    isMuted,
    isSpoilerProof,
    isCustomPlayer,
    toggleIsCustomPlayer,
  } = usePlayerStore();

  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullScreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setDuration(player.duration);
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setIsSeeking(false);
    if (playerRef.current) {
      playerRef.current.currentTime =
        Number.parseFloat(inputTarget.value) * playerRef.current.duration;
    }
  };

  const handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    console.log(inputTarget.value);
    setPlayed(Number.parseFloat(inputTarget.value));
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;

    if (!player || isSeeking) return;

    if (!player.duration) return;

    setPlayed(player.currentTime / player.duration);
  };

  const videoUrl = isVideoError
    ? (opening?.backUpVideoUrl ?? "")
    : (opening?.videoUrl ?? "");

  return (
    <div className={classesss.container} ref={containerRef}>
      <div className={classesss.header}>
        <p className={classesss.switchLabel}>Обычный плеер</p>
        <Switch checked={isCustomPlayer} onToggle={toggleIsCustomPlayer} />
        <p className={classesss.switchLabel}>Кастомный</p>
      </div>
      <div
        className={clsx(classesss.wrapper, {
          [classesss.custom]: isCustomPlayer,
        })}
      >
        <ReactPlayer
          ref={playerRef}
          src={videoUrl}
          width="100%"
          height="100%"
          controls={!isCustomPlayer}
          muted={isMuted}
          playing={isPlaying}
          volume={volume}
          onError={() => setIsVideoError(true)}
          onDurationChange={handleDurationChange}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
          onEnded={() => {
            setIsPlaying(false);
          }}
        />

        {isSpoilerProof && isCustomPlayer && <div className={classesss.blur} />}
      </div>
      {isCustomPlayer && (
        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          played={played}
          duration={duration}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onSeekChange={handleSeekChange}
          isFullScreen={isFullScreen}
          toggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
};
