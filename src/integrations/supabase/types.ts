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
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          id: string
          payment_id: string | null
          payment_method: string | null
          product_id: string | null
          seller_id: string
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          seller_id: string
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          seller_id?: string
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_plans: {
        Row: {
          created_at: string
          duration_days: number
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          duration_days: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          duration_days?: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          condition: Database["public"]["Enums"]["product_condition"] | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          location: string | null
          price: number
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          category_id?: string | null
          condition?: Database["public"]["Enums"]["product_condition"] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location?: string | null
          price: number
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          category_id?: string | null
          condition?: Database["public"]["Enums"]["product_condition"] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location?: string | null
          price?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college_name: string | null
          created_at: string
          full_name: string | null
          id: string
          is_premium: boolean | null
          phone: string | null
          premium_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          phone?: string | null
          premium_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          phone?: string | null
          premium_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_staff: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_staff?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_staff?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      listing_status: "active" | "sold" | "inactive" | "pending"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      product_condition: "new" | "like_new" | "good" | "fair" | "poor"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
      app_role: ["admin", "moderator", "user"],
      listing_status: ["active", "sold", "inactive", "pending"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      product_condition: ["new", "like_new", "good", "fair", "poor"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
