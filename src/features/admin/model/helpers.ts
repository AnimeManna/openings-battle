import type { Database } from "@/shared/database.types";
import supabase from "@/shared/supabase";

export async function fetchAll<T>(
  tableName: keyof Database["public"]["Tables"],
  selectQuery: string = "*",
): Promise<T[]> {
  let allData: T[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select(selectQuery)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allData = allData.concat(data as T[]);

    if (data.length < pageSize) break;

    page++;
  }

  return allData;
}
