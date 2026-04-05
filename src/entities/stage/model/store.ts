import { create } from "zustand";
import type { Stage } from "./types";
import supabase from "@/shared/supabase";
import { formatStage } from "./formatter";
import { notifier } from "@/shared/lib/notifier";

interface StageState {
  stagesMap: Map<string, Stage>;

  fetchStages: () => Promise<void>;
  generateFirstStage: () => Promise<void>;
  generateSingleEliminationStage: (
    prevStageId: string,
    name: string,
    roundsPerDay: number,
    additionalDays: number,
  ) => Promise<void>;
  closeCurrentStage: () => Promise<void>;
}

export const useStageStore = create<StageState>((set, get) => ({
  stagesMap: new Map(),
  fetchStages: async () => {
    const { data } = await supabase
      .from("stages")
      .select("*")
      .order("order_num", { ascending: true });
    if (!data) return;
    const formattedData = data.map(formatStage);
    const newMap = new Map(get().stagesMap);

    formattedData.forEach((stage) => {
      newMap.set(stage.id, stage);
    });

    set({ stagesMap: newMap });
    return;
  },
  generateFirstStage: async () => {
    const currentStages = get().stagesMap;
    if (currentStages.size) {
      console.warn("Stages already existed");
      return;
    }
    const { data } = await supabase.rpc("generate_first_stage");
    if (!data) return;
    console.log(data, "Stages успешно созданы");
  },
  generateSingleEliminationStage: async (
    prevStageId,
    name,
    roundsPerDay,
    additionalDays,
  ) => {
    try {
      const { error } = await supabase.rpc("generate_single_elimination", {
        p_name: name,
        p_previous_stage_id: prevStageId,
        p_rounds_per_day: roundsPerDay,
        p_stage_additional_days: additionalDays,
      });
      if (error) throw error;
      notifier.success("Стейдж успешно создан");
      get().fetchStages();
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  },
  closeCurrentStage: async () => {
    const activeStage = Array.from(get().stagesMap.values()).find(
      (stage) => stage.status === "active",
    );
    console.log(activeStage);
    if (!activeStage) return;
    try {
      const { error } = await supabase
        .from("stages")
        .update({ status: "completed" })
        .eq("id", activeStage.id);
      if (error) throw error;
      get().fetchStages();
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  },
}));
