import { getYoutubeId } from "./getYoutubeId";

export const getYoutubeThubnail = (videoUrl: string) =>
  "http://img.youtube.com/vi/" + getYoutubeId(videoUrl) + "/maxresdefault.jpg";
