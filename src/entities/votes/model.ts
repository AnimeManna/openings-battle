import { create } from "zustand";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/shared/firebase";
import type { Vote } from "./types";
import type { Opening } from "../openings/types";
import { APP_CONFIG } from "@/shared/config";

interface VotesState {
  myVotes: Record<string, Vote>;
  isLoading: boolean;

  initVotesSubscription: (userId: string) => () => void;

  submitVote: (
    userId: string,
    openingId: string,
    rate: number,
  ) => Promise<void>;
  toggleProtect: (userId: string, openingId: string) => Promise<void>;
}

export const useVotesStore = create<VotesState>((set) => ({
  myVotes: {},
  isLoading: true,

  initVotesSubscription: (userId) => {
    const q = query(collection(db, "votes"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const votesMap: Record<string, Vote> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Vote;
        votesMap[data.openingId] = data;
      });

      set({ myVotes: votesMap, isLoading: false });
    });

    return unsubscribe;
  },

  submitVote: async (userId, openingId, rate) => {
    const voteId = `${userId}_${openingId}`;
    const voteRef = doc(db, "votes", voteId);
    const openingRef = doc(db, "openings", openingId);
    const userRef = doc(db, "users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        const voteDoc = await transaction.get(voteRef);
        const openingDoc = await transaction.get(openingRef);
        const userDoc = await transaction.get(userRef);

        if (!openingDoc.exists()) throw new Error("Opening not found");

        const openingData = openingDoc.data() as Opening;
        const prevVoteData = voteDoc.exists() ? (voteDoc.data() as Vote) : null;

        const prevRate = prevVoteData?.rate || 0;

        const newScoreSum = openingData.stats.scoreSum - prevRate + rate;
        let newVotesCount = openingData.stats.votesCount;

        if (!prevVoteData) {
          newVotesCount += 1;
        }

        const newAvg = newVotesCount > 0 ? newScoreSum / newVotesCount : 0;

        transaction.update(openingRef, {
          "stats.scoreSum": newScoreSum,
          "stats.votesCount": newVotesCount,
          "stats.avgScore": newAvg,
        });

        transaction.set(
          voteRef,
          {
            userId,
            openingId,
            rate,
            isProtected: prevVoteData?.isProtected || false,
            updatedAt: Date.now(),
          },
          { merge: true },
        );

        if (!prevVoteData) {
          transaction.update(userRef, {
            votesCount: userDoc.data()?.votesCount + 1 || 1,
          });
        }
      });
    } catch (e) {
      console.error("Vote failed:", e);
    }
  },

  toggleProtect: async (userId, openingId) => {
    const voteId = `${userId}_${openingId}`;
    const voteRef = doc(db, "votes", voteId);
    const userRef = doc(db, "users", userId);
    const openingRef = doc(db, "openings", openingId);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const voteDoc = await transaction.get(voteRef);
        const openingDoc = await transaction.get(openingRef);

        const userData = userDoc.data();
        const voteData = voteDoc.exists() ? (voteDoc.data() as Vote) : null;
        const openingData = openingDoc.data() as Opening;

        const isCurrentlyProtected = voteData?.isProtected || false;
        const willBeProtected = !isCurrentlyProtected;

        const currentUsed = userData?.protectionUsed || 0;
        const maxBudget =
          userData?.protectionBudget || APP_CONFIG.DEFAULT_PROTECTION_BUDGET;

        if (willBeProtected && currentUsed >= maxBudget) {
          throw new Error("Нет щитов!");
        }

        const usageDelta = willBeProtected ? 1 : -1;

        transaction.update(userRef, {
          protectionUsed: currentUsed + usageDelta,
        });

        const isAlreadyProtected = openingData.isProtected;

        if (!isAlreadyProtected) {
          transaction.update(openingRef, {
            isProtected: true,
          });
        }

        transaction.set(
          voteRef,
          {
            userId,
            openingId,
            isProtected: willBeProtected,
            rate: voteData?.rate || 0,
            updatedAt: Date.now(),
          },
          { merge: true },
        );
      });
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  },
}));
