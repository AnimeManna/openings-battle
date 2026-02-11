export interface Opening {
  id: string;
  anime: string;
  orderNumber: number;
  title: string;
  youtubeUrl: string;
  startTime: number;
  createdAt: string;

  isProtected: boolean;

  stats: {
    scoreSum: number;
    votesCount: number;
    avgScore: number;
  };
}
