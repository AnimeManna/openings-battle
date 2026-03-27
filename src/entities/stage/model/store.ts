import { create } from "zustand";
import type { Stage } from "./types";
import supabase from "@/shared/supabase";
import { formatStage } from "./formatter";

interface StageState {
  stagesMap: Map<string, Stage>;

  fetchStages: () => Promise<void>;
  generateStages: () => Promise<void>;
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
  generateStages: async () => {
    const currentStages = get().stagesMap;
    if (currentStages.size) {
      console.warn("Stages already existed");
      return;
    }
    const { data } = await supabase.rpc("generate_first_stage");
    if (!data) return;
    console.log(data, "Stages успешно созданы");
  },
}));
