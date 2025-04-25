export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          clinic_address: string | null
          clinic_name: string | null
          created_at: string | null
          duration: number | null
          id: string
          location: string | null
          notes: string | null
          owner_id: string | null
          payment_status: string | null
          pet_id: string | null
          price: number | null
          provider_id: string | null
          provider_name: string | null
          provider_specialty: string | null
          reason: string | null
          service_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          clinic_address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_status?: string | null
          pet_id?: string | null
          price?: number | null
          provider_id?: string | null
          provider_name?: string | null
          provider_specialty?: string | null
          reason?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          clinic_address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_status?: string | null
          pet_id?: string | null
          price?: number | null
          provider_id?: string | null
          provider_name?: string | null
          provider_specialty?: string | null
          reason?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "pet_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_grooming: {
        Row: {
          availability: Json | null
          created_at: string | null
          id: string
          pricing_info: Json | null
          services_offered: Json | null
          specialization: string | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string | null
          id?: string
          pricing_info?: Json | null
          services_offered?: Json | null
          specialization?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          availability?: Json | null
          created_at?: string | null
          id?: string
          pricing_info?: Json | null
          services_offered?: Json | null
          specialization?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_grooming_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medical_history: {
        Row: {
          allergies: string | null
          chronic_conditions: string | null
          created_at: string | null
          current_medications: Json | null
          id: string
          pet_id: string | null
          previous_surgeries: Json | null
          vaccines_document_url: string | null
        }
        Insert: {
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          current_medications?: Json | null
          id?: string
          pet_id?: string | null
          previous_surgeries?: Json | null
          vaccines_document_url?: string | null
        }
        Update: {
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          current_medications?: Json | null
          id?: string
          pet_id?: string | null
          previous_surgeries?: Json | null
          vaccines_document_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_medical_history_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_owners: {
        Row: {
          address: string | null
          id: string
          phone_number: string | null
          profile_picture_url: string | null
        }
        Insert: {
          address?: string | null
          id: string
          phone_number?: string | null
          profile_picture_url?: string | null
        }
        Update: {
          address?: string | null
          id?: string
          phone_number?: string | null
          profile_picture_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_owners_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          additional_notes: string | null
          breed: string | null
          created_at: string | null
          date_of_birth: string | null
          id: string
          name: string
          owner_id: string | null
          profile_picture_url: string | null
          sex: string | null
          species: string
          temperament: string | null
          weight: number | null
        }
        Insert: {
          additional_notes?: string | null
          breed?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          name: string
          owner_id?: string | null
          profile_picture_url?: string | null
          sex?: string | null
          species: string
          temperament?: string | null
          weight?: number | null
        }
        Update: {
          additional_notes?: string | null
          breed?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          profile_picture_url?: string | null
          sex?: string | null
          species?: string
          temperament?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "pet_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          display_name: string
          email: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          display_name: string
          email: string
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          address: string | null
          business_hours: Json | null
          business_name: string | null
          created_at: string | null
          id: string
          phone_number: string | null
          provider_type: string
        }
        Insert: {
          address?: string | null
          business_hours?: Json | null
          business_name?: string | null
          created_at?: string | null
          id: string
          phone_number?: string | null
          provider_type: string
        }
        Update: {
          address?: string | null
          business_hours?: Json | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          phone_number?: string | null
          provider_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarians: {
        Row: {
          availability: Json | null
          bio: string | null
          id: string
          license_number: string | null
          specialization: string | null
          years_of_experience: number | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          id: string
          license_number?: string | null
          specialization?: string | null
          years_of_experience?: number | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          id?: string
          license_number?: string | null
          specialization?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "veterinarians_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_pet_grooming: {
        Args: { groomer_id: string }
        Returns: undefined
      }
      create_pet_owner: {
        Args: { owner_id: string }
        Returns: undefined
      }
      create_service_provider: {
        Args: { provider_id: string }
        Returns: undefined
      }
      create_veterinarian: {
        Args: { vet_id: string }
        Returns: undefined
      }
      update_provider_type: {
        Args: { provider_id: string; provider_type_val: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
