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
      bookings: {
        Row: {
          booking_date: string
          cancellation_reason: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          cancellation_reason?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          cancellation_reason?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          anon_id: string | null
          content: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          anon_id?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          anon_id?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      class_packs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          num_classes: number
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          num_classes: number
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          num_classes?: number
          price?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          email_sent: boolean
          full_name: string
          id: string
          message: string
          phone: string
          source_page: string
          town: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_sent?: boolean
          full_name: string
          id?: string
          message: string
          phone: string
          source_page?: string
          town?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_sent?: boolean
          full_name?: string
          id?: string
          message?: string
          phone?: string
          source_page?: string
          town?: string | null
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          analytics: boolean
          anon_id: string
          created_at: string
          id: string
          marketing: boolean
          necessary: boolean
          policy_version: string
          preferences: boolean
          source_url: string | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analytics?: boolean
          anon_id: string
          created_at?: string
          id?: string
          marketing?: boolean
          necessary?: boolean
          policy_version?: string
          preferences?: boolean
          source_url?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analytics?: boolean
          anon_id?: string
          created_at?: string
          id?: string
          marketing?: boolean
          necessary?: boolean
          policy_version?: string
          preferences?: boolean
          source_url?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      matriculas: {
        Row: {
          address: string
          city: string
          contrato_asociado: string | null
          contrato_firmado_url: string | null
          created_at: string
          date_of_birth: string | null
          dni: string
          dni_anverso_url: string | null
          dni_reverso_url: string | null
          email: string
          estado_matricula: string
          estado_pago: string
          fecha_pago: string | null
          full_name: string
          id: string
          notes: string
          pack_id: string | null
          pack_name: string
          phone: string
          postal_code: string
          precio: number | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string
          city?: string
          contrato_asociado?: string | null
          contrato_firmado_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          dni?: string
          dni_anverso_url?: string | null
          dni_reverso_url?: string | null
          email: string
          estado_matricula?: string
          estado_pago?: string
          fecha_pago?: string | null
          full_name: string
          id?: string
          notes?: string
          pack_id?: string | null
          pack_name?: string
          phone?: string
          postal_code?: string
          precio?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          contrato_asociado?: string | null
          contrato_firmado_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          dni?: string
          dni_anverso_url?: string | null
          dni_reverso_url?: string | null
          email?: string
          estado_matricula?: string
          estado_pago?: string
          fecha_pago?: string | null
          full_name?: string
          id?: string
          notes?: string
          pack_id?: string | null
          pack_name?: string
          phone?: string
          postal_code?: string
          precio?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      packs_matricula: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          num_practice_classes: number
          price: number
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
          num_practice_classes?: number
          price?: number
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          num_practice_classes?: number
          price?: number
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          classes_purchased: number
          classes_remaining: number
          created_at: string
          id: string
          pack_id: string | null
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          classes_purchased?: number
          classes_remaining?: number
          created_at?: string
          id?: string
          pack_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          classes_purchased?: number
          classes_remaining?: number
          created_at?: string
          id?: string
          pack_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "class_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_teacher_id: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          dni: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          postal_code: string | null
          residence: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_teacher_id?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dni?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          postal_code?: string | null
          residence?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_teacher_id?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dni?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          postal_code?: string | null
          residence?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          teacher_id?: string
        }
        Relationships: []
      }
      teacher_blocked_slots: {
        Row: {
          blocked_date: string
          created_at: string
          end_time: string
          id: string
          reason: string | null
          start_time: string
          teacher_id: string
        }
        Insert: {
          blocked_date: string
          created_at?: string
          end_time: string
          id?: string
          reason?: string | null
          start_time: string
          teacher_id: string
        }
        Update: {
          blocked_date?: string
          created_at?: string
          end_time?: string
          id?: string
          reason?: string | null
          start_time?: string
          teacher_id?: string
        }
        Relationships: []
      }
      test_attempt_answers: {
        Row: {
          attempt_id: string
          correct_index: number
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          question_text: string
          selected_index: number | null
          test_id: string
          user_id: string
        }
        Insert: {
          attempt_id: string
          correct_index: number
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          question_text: string
          selected_index?: number | null
          test_id: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          correct_index?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          question_text?: string
          selected_index?: number | null
          test_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          correct_answers: number
          created_at: string
          duration_seconds: number
          errors: number
          id: string
          passed: boolean
          score_percentage: number
          test_id: string
          total_questions: number
          user_id: string
        }
        Insert: {
          correct_answers: number
          created_at?: string
          duration_seconds?: number
          errors: number
          id?: string
          passed: boolean
          score_percentage: number
          test_id: string
          total_questions: number
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string
          duration_seconds?: number
          errors?: number
          id?: string
          passed?: boolean
          score_percentage?: number
          test_id?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          pass_threshold: number
          questions: Json
          title: string
          total_questions: number
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          pass_threshold?: number
          questions?: Json
          title: string
          total_questions?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          pass_threshold?: number
          questions?: Json
          title?: string
          total_questions?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_matricula_document: { Args: never; Returns: boolean }
      can_upload_matricula_document: {
        Args: { _object_name: string }
        Returns: boolean
      }
      can_view_matricula_document: {
        Args: { _object_name: string }
        Returns: boolean
      }
      deduct_classes: {
        Args: { _num_classes: number; _user_id: string }
        Returns: undefined
      }
      get_taken_slots: {
        Args: { _booking_date: string; _teacher_name: string }
        Returns: {
          end_time: string
          start_time: string
        }[]
      }
      get_test_for_attempt: { Args: { _test_id: string }; Returns: Json }
      get_test_for_study: { Args: { _test_id: string }; Returns: Json }
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
      list_available_tests: {
        Args: never
        Returns: {
          category: string
          id: string
          pass_threshold: number
          title: string
          total_questions: number
        }[]
      }
      owns_matricula: { Args: { _matricula_id: string }; Returns: boolean }
      refund_class: { Args: { _user_id: string }; Returns: undefined }
      secretaria_add_classes: {
        Args: {
          _amount?: number
          _note?: string
          _num_classes: number
          _user_id: string
        }
        Returns: string
      }
      secretaria_get_test_readiness: {
        Args: { _user_ids: string[] }
        Returns: {
          attempts_count: number
          readiness: number
          tests_count: number
          user_id: string
        }[]
      }
      secretaria_get_user_balances: {
        Args: { _user_ids: string[] }
        Returns: {
          balance: number
          user_id: string
        }[]
      }
      submit_test_attempt: {
        Args: { _answers: Json; _duration_seconds?: number; _test_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin" | "secretaria"
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
      app_role: ["student", "teacher", "admin", "secretaria"],
    },
  },
} as const
