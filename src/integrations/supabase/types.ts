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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments_cache: {
        Row: {
          clinic_id: string
          doctor_external_id: string | null
          doctor_name: string | null
          duration_minutes: number | null
          external_appointment_id: string
          id: string
          lead_id: string | null
          patient_external_id: string
          patient_name: string
          procedure: string | null
          raw_payload: Json | null
          scheduled_at: string
          status: string | null
          synced_at: string
        }
        Insert: {
          clinic_id: string
          doctor_external_id?: string | null
          doctor_name?: string | null
          duration_minutes?: number | null
          external_appointment_id: string
          id?: string
          lead_id?: string | null
          patient_external_id: string
          patient_name: string
          procedure?: string | null
          raw_payload?: Json | null
          scheduled_at: string
          status?: string | null
          synced_at?: string
        }
        Update: {
          clinic_id?: string
          doctor_external_id?: string | null
          doctor_name?: string | null
          duration_minutes?: number | null
          external_appointment_id?: string
          id?: string
          lead_id?: string | null
          patient_external_id?: string
          patient_name?: string
          procedure?: string | null
          raw_payload?: Json | null
          scheduled_at?: string
          status?: string | null
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_cache_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_cache_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_members: {
        Row: {
          clinic_id: string
          created_at: string
          id: string
          is_default: boolean
          role_id: string
          user_id: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          id?: string
          is_default?: boolean
          role_id: string
          user_id: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          id?: string
          is_default?: boolean
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_members_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          ai_paused: boolean
          assigned_to: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          created_at: string
          handoff_at: string | null
          handoff_by: string | null
          handoff_reason: string | null
          id: string
          last_message_at: string | null
          lead_id: string
          status: Database["public"]["Enums"]["conversation_status"]
          unread_count: number
          updated_at: string
        }
        Insert: {
          ai_paused?: boolean
          assigned_to?: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          created_at?: string
          handoff_at?: string | null
          handoff_by?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id: string
          status?: Database["public"]["Enums"]["conversation_status"]
          unread_count?: number
          updated_at?: string
        }
        Update: {
          ai_paused?: boolean
          assigned_to?: string | null
          channel?: Database["public"]["Enums"]["lead_channel"]
          clinic_id?: string
          created_at?: string
          handoff_at?: string | null
          handoff_by?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_templates: {
        Row: {
          clinic_id: string
          created_at: string
          days_offset: number | null
          id: string
          is_active: boolean
          message_template: string
          name: string
          requires_approval: boolean
          type: Database["public"]["Enums"]["follow_up_type"]
          updated_at: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          days_offset?: number | null
          id?: string
          is_active?: boolean
          message_template: string
          name: string
          requires_approval?: boolean
          type: Database["public"]["Enums"]["follow_up_type"]
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          days_offset?: number | null
          id?: string
          is_active?: boolean
          message_template?: string
          name?: string
          requires_approval?: boolean
          type?: Database["public"]["Enums"]["follow_up_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_templates_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          lead_id: string
          message_preview: string
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["follow_up_status"]
          template_id: string | null
          type: Database["public"]["Enums"]["follow_up_type"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          lead_id: string
          message_preview: string
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          template_id?: string | null
          type: Database["public"]["Enums"]["follow_up_type"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          channel?: Database["public"]["Enums"]["lead_channel"]
          clinic_id?: string
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          message_preview?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          template_id?: string | null
          type?: Database["public"]["Enums"]["follow_up_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "follow_up_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_consents: {
        Row: {
          consent_source: string | null
          consented_at: string | null
          data_sharing_opt_in: boolean
          id: string
          lead_id: string
          marketing_opt_in: boolean
          reminders_opt_in: boolean
          revoked_at: string | null
          updated_at: string
        }
        Insert: {
          consent_source?: string | null
          consented_at?: string | null
          data_sharing_opt_in?: boolean
          id?: string
          lead_id: string
          marketing_opt_in?: boolean
          reminders_opt_in?: boolean
          revoked_at?: string | null
          updated_at?: string
        }
        Update: {
          consent_source?: string | null
          consented_at?: string | null
          data_sharing_opt_in?: boolean
          id?: string
          lead_id?: string
          marketing_opt_in?: boolean
          reminders_opt_in?: boolean
          revoked_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_consents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tag_assignments: {
        Row: {
          assigned_at: string
          lead_id: string
          tag_id: string
        }
        Insert: {
          assigned_at?: string
          lead_id: string
          tag_id: string
        }
        Update: {
          assigned_at?: string
          lead_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tag_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "lead_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tags: {
        Row: {
          clinic_id: string
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          clinic_id: string
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          clinic_id?: string
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tags_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          cpf: string | null
          created_at: string
          email: string | null
          estimated_value_brl: number | null
          external_contact_id: string | null
          id: string
          last_interaction_at: string | null
          lost_notes: string | null
          lost_reason: Database["public"]["Enums"]["lost_reason"] | null
          name: string
          notes: string | null
          patient_external_id: string | null
          phone: string | null
          procedure_interest: string | null
          referral_source: string | null
          score: number | null
          source_campaign: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          channel: Database["public"]["Enums"]["lead_channel"]
          clinic_id: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          estimated_value_brl?: number | null
          external_contact_id?: string | null
          id?: string
          last_interaction_at?: string | null
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          name: string
          notes?: string | null
          patient_external_id?: string | null
          phone?: string | null
          procedure_interest?: string | null
          referral_source?: string | null
          score?: number | null
          source_campaign?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          channel?: Database["public"]["Enums"]["lead_channel"]
          clinic_id?: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          estimated_value_brl?: number | null
          external_contact_id?: string | null
          id?: string
          last_interaction_at?: string | null
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          name?: string
          notes?: string | null
          patient_external_id?: string | null
          phone?: string | null
          procedure_interest?: string | null
          referral_source?: string | null
          score?: number | null
          source_campaign?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_confidence: number | null
          clinic_id: string
          content: string
          conversation_id: string
          created_at: string
          delivery_status: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message: string | null
          external_message_id: string | null
          id: string
          media_type: string | null
          media_url: string | null
          sender: Database["public"]["Enums"]["message_sender"]
          sent_by: string | null
        }
        Insert: {
          ai_confidence?: number | null
          clinic_id: string
          content: string
          conversation_id: string
          created_at?: string
          delivery_status?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          sender: Database["public"]["Enums"]["message_sender"]
          sent_by?: string | null
        }
        Update: {
          ai_confidence?: number | null
          clinic_id?: string
          content?: string
          conversation_id?: string
          created_at?: string
          delivery_status?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          sender?: Database["public"]["Enums"]["message_sender"]
          sent_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          cro: string | null
          email: string
          full_name: string | null
          id: string
          last_sign_in_at: string | null
          phone: string | null
          procedures: string[] | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          cro?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_sign_in_at?: string | null
          phone?: string | null
          procedures?: string[] | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          cro?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_sign_in_at?: string | null
          phone?: string | null
          procedures?: string[] | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          module: Database["public"]["Enums"]["app_module"]
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module: Database["public"]["Enums"]["app_module"]
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module?: Database["public"]["Enums"]["app_module"]
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          clinic_id: string
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          clinic_id: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          clinic_id?: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_clinic_module_access: {
        Args: {
          _clinic_id: string
          _module: Database["public"]["Enums"]["app_module"]
          _user_id: string
        }
        Returns: boolean
      }
      has_module_access: {
        Args: {
          _module: Database["public"]["Enums"]["app_module"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_approved: { Args: { _user_id: string }; Returns: boolean }
      is_clinic_admin: {
        Args: { _clinic_id: string; _user_id: string }
        Returns: boolean
      }
      is_clinic_member: {
        Args: { _clinic_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_module:
        | "dashboard"
        | "atendimento"
        | "leads"
        | "agenda"
        | "ia-config"
        | "upload"
        | "suporte"
        | "configuracoes"
      approval_status: "pending" | "approved" | "rejected"
      conversation_status: "ativa" | "aguardando" | "encerrada"
      follow_up_status:
        | "pendente"
        | "aprovado"
        | "enviado"
        | "cancelado"
        | "falhou"
      follow_up_type:
        | "pos_consulta"
        | "tratamento_nao_concluido"
        | "rechamada_longa"
        | "paciente_sumiu"
        | "confirmacao_orcamento"
        | "aniversario"
        | "retorno_recorrente"
        | "custom"
      lead_channel: "whatsapp" | "instagram" | "indicacao" | "manual" | "outro"
      lead_status:
        | "novo"
        | "qualificado"
        | "em_atendimento"
        | "agendado"
        | "compareceu"
        | "convertido"
        | "perdido"
      lost_reason:
        | "preco"
        | "distancia"
        | "tempo_espera"
        | "concorrente"
        | "sem_resposta"
        | "outro"
      message_direction: "inbound" | "outbound"
      message_sender: "ai" | "lead" | "human"
      task_priority: "baixa" | "media" | "alta" | "urgente"
      task_status: "aberta" | "em_andamento" | "concluida" | "cancelada"
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
      app_module: [
        "dashboard",
        "atendimento",
        "leads",
        "agenda",
        "ia-config",
        "upload",
        "suporte",
        "configuracoes",
      ],
      approval_status: ["pending", "approved", "rejected"],
      conversation_status: ["ativa", "aguardando", "encerrada"],
      follow_up_status: [
        "pendente",
        "aprovado",
        "enviado",
        "cancelado",
        "falhou",
      ],
      follow_up_type: [
        "pos_consulta",
        "tratamento_nao_concluido",
        "rechamada_longa",
        "paciente_sumiu",
        "confirmacao_orcamento",
        "aniversario",
        "retorno_recorrente",
        "custom",
      ],
      lead_channel: ["whatsapp", "instagram", "indicacao", "manual", "outro"],
      lead_status: [
        "novo",
        "qualificado",
        "em_atendimento",
        "agendado",
        "compareceu",
        "convertido",
        "perdido",
      ],
      lost_reason: [
        "preco",
        "distancia",
        "tempo_espera",
        "concorrente",
        "sem_resposta",
        "outro",
      ],
      message_direction: ["inbound", "outbound"],
      message_sender: ["ai", "lead", "human"],
      task_priority: ["baixa", "media", "alta", "urgente"],
      task_status: ["aberta", "em_andamento", "concluida", "cancelada"],
    },
  },
} as const
