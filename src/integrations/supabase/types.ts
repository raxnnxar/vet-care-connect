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
          canceled_reason: string | null
          created_at: string | null
          duration: number | null
          follow_up_appointment_id: string | null
          id: string
          location: string | null
          notes: string | null
          owner_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          pet_id: string | null
          price: number | null
          provider_id: string | null
          reason: string | null
          reminder_sent: boolean | null
          service_type: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          canceled_reason?: string | null
          created_at?: string | null
          duration?: number | null
          follow_up_appointment_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pet_id?: string | null
          price?: number | null
          provider_id?: string | null
          reason?: string | null
          reminder_sent?: boolean | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          canceled_reason?: string | null
          created_at?: string | null
          duration?: number | null
          follow_up_appointment_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pet_id?: string | null
          price?: number | null
          provider_id?: string | null
          reason?: string | null
          reminder_sent?: boolean | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_follow_up_appointment_id_fkey"
            columns: ["follow_up_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_follow_up_appointment_id_fkey"
            columns: ["follow_up_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["owner_id"]
          },
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
            referencedRelation: "appointment_details"
            referencedColumns: ["pet_id"]
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
            foreignKeyName: "fk_appointments_owner"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "fk_appointments_owner"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "pet_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["pet_id"]
          },
          {
            foreignKeyName: "fk_appointments_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["vet_id"]
          },
          {
            foreignKeyName: "fk_appointments_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
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
            referencedRelation: "appointment_details"
            referencedColumns: ["pet_id"]
          },
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
          primary_vet_id: string | null
          profile_picture_url: string | null
        }
        Insert: {
          address?: string | null
          id: string
          phone_number?: string | null
          primary_vet_id?: string | null
          profile_picture_url?: string | null
        }
        Update: {
          address?: string | null
          id?: string
          phone_number?: string | null
          primary_vet_id?: string | null
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
          {
            foreignKeyName: "pet_owners_primary_vet_id_fkey"
            columns: ["primary_vet_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["vet_id"]
          },
          {
            foreignKeyName: "pet_owners_primary_vet_id_fkey"
            columns: ["primary_vet_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
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
            referencedRelation: "appointment_details"
            referencedColumns: ["owner_id"]
          },
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
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          pet_owner_id: string
          rating: number
          updated_at: string | null
          veterinarian_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pet_owner_id: string
          rating: number
          updated_at?: string | null
          veterinarian_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pet_owner_id?: string
          rating?: number
          updated_at?: string | null
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["vet_id"]
          },
          {
            foreignKeyName: "reviews_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
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
          animals_treated: Json | null
          availability: Json | null
          average_rating: number | null
          bio: string | null
          certifications: Json | null
          education: Json | null
          emergency_services: boolean | null
          id: string
          languages_spoken: Json | null
          license_document_url: string | null
          license_number: string | null
          profile_image_url: string | null
          services_offered: Json | null
          specialization: Json | null
          total_reviews: number | null
          years_of_experience: number | null
        }
        Insert: {
          animals_treated?: Json | null
          availability?: Json | null
          average_rating?: number | null
          bio?: string | null
          certifications?: Json | null
          education?: Json | null
          emergency_services?: boolean | null
          id: string
          languages_spoken?: Json | null
          license_document_url?: string | null
          license_number?: string | null
          profile_image_url?: string | null
          services_offered?: Json | null
          specialization?: Json | null
          total_reviews?: number | null
          years_of_experience?: number | null
        }
        Update: {
          animals_treated?: Json | null
          availability?: Json | null
          average_rating?: number | null
          bio?: string | null
          certifications?: Json | null
          education?: Json | null
          emergency_services?: boolean | null
          id?: string
          languages_spoken?: Json | null
          license_document_url?: string | null
          license_number?: string | null
          profile_image_url?: string | null
          services_offered?: Json | null
          specialization?: Json | null
          total_reviews?: number | null
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
      appointment_details: {
        Row: {
          appointment_date: string | null
          canceled_reason: string | null
          duration: number | null
          id: string | null
          notes: string | null
          owner_id: string | null
          owner_name: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          pet_id: string | null
          pet_name: string | null
          pet_species: string | null
          price: number | null
          reason: string | null
          reminder_sent: boolean | null
          service_type: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          vet_id: string | null
          vet_name: string | null
          vet_specialty: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_owners_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarians_id_fkey"
            columns: ["vet_id"]
            isOneToOne: true
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
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
      appointment_status:
        | "programada"
        | "completada"
        | "cancelada"
        | "reprogramada"
        | "no_asistió"
        | "pendiente"
      payment_status: "pendiente" | "pagado" | "reembolsado" | "parcial"
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
    Enums: {
      appointment_status: [
        "programada",
        "completada",
        "cancelada",
        "reprogramada",
        "no_asistió",
        "pendiente",
      ],
      payment_status: ["pendiente", "pagado", "reembolsado", "parcial"],
    },
  },
} as const
