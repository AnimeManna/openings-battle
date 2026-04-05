export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      anime: {
        Row: {
          created_by: string | null
          created_on: string | null
          english_title: string | null
          id: string
          is_active: boolean | null
          japanese_title: string | null
          modified_on: string | null
          nicknames: string[] | null
          release_date: string | null
          russian_title: string | null
          studio: string | null
        }
        Insert: {
          created_by?: string | null
          created_on?: string | null
          english_title?: string | null
          id?: string
          is_active?: boolean | null
          japanese_title?: string | null
          modified_on?: string | null
          nicknames?: string[] | null
          release_date?: string | null
          russian_title?: string | null
          studio?: string | null
        }
        Update: {
          created_by?: string | null
          created_on?: string | null
          english_title?: string | null
          id?: string
          is_active?: boolean | null
          japanese_title?: string | null
          modified_on?: string | null
          nicknames?: string[] | null
          release_date?: string | null
          russian_title?: string | null
          studio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anime_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anime_search_raw: {
        Row: {
          anime: string
          id: string
          video_title: string | null
          video_url: string | null
        }
        Insert: {
          anime: string
          id?: string
          video_title?: string | null
          video_url?: string | null
        }
        Update: {
          anime?: string
          id?: string
          video_title?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      artists: {
        Row: {
          alternative_name: string[] | null
          created_by: string | null
          created_on: string | null
          id: string
          is_active: boolean | null
          modified_on: string | null
          name: string | null
        }
        Insert: {
          alternative_name?: string[] | null
          created_by?: string | null
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          modified_on?: string | null
          name?: string | null
        }
        Update: {
          alternative_name?: string[] | null
          created_by?: string | null
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          modified_on?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_metrics: {
        Row: {
          avg_score: number | null
          is_protected: boolean | null
          max_score: number | null
          min_score: number | null
          modified_on: string | null
          opening_id: string
          score_sum: number | null
          votes_count: number | null
        }
        Insert: {
          avg_score?: number | null
          is_protected?: boolean | null
          max_score?: number | null
          min_score?: number | null
          modified_on?: string | null
          opening_id: string
          score_sum?: number | null
          votes_count?: number | null
        }
        Update: {
          avg_score?: number | null
          is_protected?: boolean | null
          max_score?: number | null
          min_score?: number | null
          modified_on?: string | null
          opening_id?: string
          score_sum?: number | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opening_metrics_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: true
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      openings: {
        Row: {
          anime: string | null
          created_by: string | null
          created_on: string | null
          id: string
          is_active: boolean | null
          modified_on: string | null
          opening_num: number | null
          season_num: number | null
          title: string | null
        }
        Insert: {
          anime?: string | null
          created_by?: string | null
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          modified_on?: string | null
          opening_num?: number | null
          season_num?: number | null
          title?: string | null
        }
        Update: {
          anime?: string | null
          created_by?: string | null
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          modified_on?: string | null
          opening_num?: number | null
          season_num?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "openings_anime_fkey"
            columns: ["anime"]
            isOneToOne: false
            referencedRelation: "anime"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      openings_artists: {
        Row: {
          artist_id: string
          created_on: string | null
          is_active: boolean | null
          modified_on: string | null
          opening_id: string
          role: string | null
        }
        Insert: {
          artist_id: string
          created_on?: string | null
          is_active?: boolean | null
          modified_on?: string | null
          opening_id: string
          role?: string | null
        }
        Update: {
          artist_id?: string
          created_on?: string | null
          is_active?: boolean | null
          modified_on?: string | null
          opening_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "openings_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_artists_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      openings_media: {
        Row: {
          created_on: string | null
          modified_on: string | null
          opening_id: string
          vimeo_url: string | null
          youtube_url_extra: string | null
          youtube_url_main: string | null
        }
        Insert: {
          created_on?: string | null
          modified_on?: string | null
          opening_id: string
          vimeo_url?: string | null
          youtube_url_extra?: string | null
          youtube_url_main?: string | null
        }
        Update: {
          created_on?: string | null
          modified_on?: string | null
          opening_id?: string
          vimeo_url?: string | null
          youtube_url_extra?: string | null
          youtube_url_main?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "openings_media_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: true
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_on: string | null
          email: string | null
          id: string
          is_service_account: boolean | null
          username: string | null
        }
        Insert: {
          created_on?: string | null
          email?: string | null
          id: string
          is_service_account?: boolean | null
          username?: string | null
        }
        Update: {
          created_on?: string | null
          email?: string | null
          id?: string
          is_service_account?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
      protections: {
        Row: {
          created_on: string | null
          is_protected: boolean | null
          modified_on: string | null
          opening_id: string
          user_id: string
        }
        Insert: {
          created_on?: string | null
          is_protected?: boolean | null
          modified_on?: string | null
          opening_id: string
          user_id: string
        }
        Update: {
          created_on?: string | null
          is_protected?: boolean | null
          modified_on?: string | null
          opening_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protections_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      protections_history: {
        Row: {
          created_on: string | null
          id: string
          is_active: boolean | null
          is_protected: boolean | null
          opening_id: string | null
          operation_type: string | null
          user_id: string | null
        }
        Insert: {
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          is_protected?: boolean | null
          opening_id?: string | null
          operation_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          is_protected?: boolean | null
          opening_id?: string | null
          operation_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "protections_history_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protections_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      round_participants: {
        Row: {
          is_winner: boolean
          opening_id: string
          round_id: string
          votes_count: number
        }
        Insert: {
          is_winner?: boolean
          opening_id: string
          round_id: string
          votes_count?: number
        }
        Update: {
          is_winner?: boolean
          opening_id?: string
          round_id?: string
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "round_participants_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "stage_participants"
            referencedColumns: ["opening_id"]
          },
          {
            foreignKeyName: "round_participants_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      round_votes: {
        Row: {
          created_at: string
          opening_id: string
          round_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          opening_id: string
          round_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          opening_id?: string
          round_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vote_must_be_valid_participant"
            columns: ["round_id", "opening_id"]
            isOneToOne: false
            referencedRelation: "round_participants"
            referencedColumns: ["round_id", "opening_id"]
          },
          {
            foreignKeyName: "phase2_votes_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "stage_participants"
            referencedColumns: ["opening_id"]
          },
          {
            foreignKeyName: "phase2_votes_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase2_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      round_votes_history: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          opening_id: string
          operation_type: string | null
          round_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          opening_id: string
          operation_type?: string | null
          round_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          opening_id?: string
          operation_type?: string | null
          round_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_votes_history_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_votes_history_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_votes_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rounds: {
        Row: {
          created_at: string
          id: string
          name: string
          order_num: number
          stage_id: string
          start_at: string
          status: Database["public"]["Enums"]["round_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_num: number
          stage_id: string
          start_at?: string
          status?: Database["public"]["Enums"]["round_status"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_num?: number
          stage_id?: string
          start_at?: string
          status?: Database["public"]["Enums"]["round_status"]
        }
        Relationships: [
          {
            foreignKeyName: "rounds_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_participants: {
        Row: {
          created_at: string
          opening_id: string
          seed_score: number
        }
        Insert: {
          created_at?: string
          opening_id: string
          seed_score?: number
        }
        Update: {
          created_at?: string
          opening_id?: string
          seed_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: true
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      stages: {
        Row: {
          completed_at: string
          created_at: string
          format: Database["public"]["Enums"]["round_format"]
          id: string
          max_choices_per_round: number
          name: string
          order_num: number
          participants_per_round: number
          started_at: string
          status: Database["public"]["Enums"]["stage_status"]
          total_participants: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          format: Database["public"]["Enums"]["round_format"]
          id?: string
          max_choices_per_round?: number
          name: string
          order_num: number
          participants_per_round: number
          started_at?: string
          status?: Database["public"]["Enums"]["stage_status"]
          total_participants: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          format?: Database["public"]["Enums"]["round_format"]
          id?: string
          max_choices_per_round?: number
          name?: string
          order_num?: number
          participants_per_round?: number
          started_at?: string
          status?: Database["public"]["Enums"]["stage_status"]
          total_participants?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_on: string | null
          modified_on: string | null
          opening_id: string
          rate: number | null
          user_id: string
        }
        Insert: {
          created_on?: string | null
          modified_on?: string | null
          opening_id: string
          rate?: number | null
          user_id: string
        }
        Update: {
          created_on?: string | null
          modified_on?: string | null
          opening_id?: string
          rate?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes_history: {
        Row: {
          created_on: string | null
          id: string
          is_active: boolean | null
          opening_id: string | null
          operation_type: string | null
          rate: number | null
          user_id: string | null
        }
        Insert: {
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          opening_id?: string | null
          operation_type?: string | null
          rate?: number | null
          user_id?: string | null
        }
        Update: {
          created_on?: string | null
          id?: string
          is_active?: boolean | null
          opening_id?: string | null
          operation_type?: string | null
          rate?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_history_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_first_stage: {
        Args: {
          p_format?: Database["public"]["Enums"]["round_format"]
          p_max_choices_per_round?: number
          p_name?: string
          p_participations_per_round?: number
          p_rounds_per_day?: number
        }
        Returns: string
      }
      generate_participants: { Args: never; Returns: undefined }
      generate_single_elimination: {
        Args: {
          p_name: string
          p_previous_stage_id: string
          p_rounds_per_day: number
          p_stage_additional_days: number
        }
        Returns: string
      }
      get_sorted_openings: {
        Args: { p_user_id: string }
        Returns: {
          anime_data: Json
          artists: Json
          id: string
          opening_num: number
          season_num: number
          title: string
          youtube_url_extra: string
          youtube_url_main: string
        }[]
      }
      get_sorted_rounds: {
        Args: { p_stage_id: string; p_user_id: string }
        Returns: {
          id: string
          max_choices: number
          name: string
          opning_ids: string[]
          start_at: string
          status: Database["public"]["Enums"]["round_status"]
        }[]
      }
    }
    Enums: {
      app_permission: "openings.delete" | "openings.create"
      app_role: "admin" | "player" | "judge"
      round_format: "single_elimination" | "round_robin"
      round_status: "pending" | "active" | "completed"
      stage_status: "pending" | "active" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_permission: ["openings.delete", "openings.create"],
      app_role: ["admin", "player", "judge"],
      round_format: ["single_elimination", "round_robin"],
      round_status: ["pending", "active", "completed"],
      stage_status: ["pending", "active", "completed"],
    },
  },
} as const
