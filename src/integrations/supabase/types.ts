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
          appointment_date: Json
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
          provider_id: string | null
          reason: string | null
          reminder_sent: boolean | null
          service_type: Json | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: Json
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
          provider_id?: string | null
          reason?: string | null
          reminder_sent?: boolean | null
          service_type?: Json | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: Json
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
          provider_id?: string | null
          reason?: string | null
          reminder_sent?: boolean | null
          service_type?: Json | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "pets"
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
      conversations: {
        Row: {
          id: string
          last_message: string | null
          last_updated: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          id?: string
          last_message?: string | null
          last_updated?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          id?: string
          last_message?: string | null
          last_updated?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          timestamp: string | null
        }
        Insert: {
          conversation_id: string
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          timestamp?: string | null
        }
        Update: {
          conversation_id?: string
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_medications: {
        Row: {
          category: Database["public"]["Enums"]["owner_med_category"] | null
          created_at: string | null
          dosage: string | null
          frequency_hours: number | null
          id: string
          instructions: string | null
          medication: string | null
          pet_id: string | null
          start_date: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["owner_med_category"] | null
          created_at?: string | null
          dosage?: string | null
          frequency_hours?: number | null
          id?: string
          instructions?: string | null
          medication?: string | null
          pet_id?: string | null
          start_date?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["owner_med_category"] | null
          created_at?: string | null
          dosage?: string | null
          frequency_hours?: number | null
          id?: string
          instructions?: string | null
          medication?: string | null
          pet_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_grooming: {
        Row: {
          animals_accepted: Json | null
          availability: Json | null
          average_rating: number | null
          business_name: string | null
          created_at: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          profile_image_url: string | null
          services_offered: Json | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          animals_accepted?: Json | null
          availability?: Json | null
          average_rating?: number | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          profile_image_url?: string | null
          services_offered?: Json | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          animals_accepted?: Json | null
          availability?: Json | null
          average_rating?: number | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          profile_image_url?: string | null
          services_offered?: Json | null
          total_reviews?: number | null
          updated_at?: string | null
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
          id: string
          pet_id: string | null
          previous_surgeries: Json | null
        }
        Insert: {
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          id?: string
          pet_id?: string | null
          previous_surgeries?: Json | null
        }
        Update: {
          allergies?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          id?: string
          pet_id?: string | null
          previous_surgeries?: Json | null
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
          latitude: number | null
          longitude: number | null
          phone_number: string | null
          primary_grooming_id: string | null
          primary_vet_id: string | null
          profile_picture_url: string | null
          reminders_enabled: boolean | null
          share_location: boolean | null
        }
        Insert: {
          address?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          primary_grooming_id?: string | null
          primary_vet_id?: string | null
          profile_picture_url?: string | null
          reminders_enabled?: boolean | null
          share_location?: boolean | null
        }
        Update: {
          address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          primary_grooming_id?: string | null
          primary_vet_id?: string | null
          profile_picture_url?: string | null
          reminders_enabled?: boolean | null
          share_location?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_primary_grooming"
            columns: ["primary_grooming_id"]
            isOneToOne: false
            referencedRelation: "pet_grooming"
            referencedColumns: ["id"]
          },
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
          primary_grooming_id: string | null
          primary_vet_id: string | null
          profile_picture_url: string | null
          sex: string | null
          species: string
          temperament: string | null
          updated_at: string | null
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
          primary_grooming_id?: string | null
          primary_vet_id?: string | null
          profile_picture_url?: string | null
          sex?: string | null
          species: string
          temperament?: string | null
          updated_at?: string | null
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
          primary_grooming_id?: string | null
          primary_vet_id?: string | null
          profile_picture_url?: string | null
          sex?: string | null
          species?: string
          temperament?: string | null
          updated_at?: string | null
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
          {
            foreignKeyName: "pets_primary_grooming_id_fkey"
            columns: ["primary_grooming_id"]
            isOneToOne: false
            referencedRelation: "pet_grooming"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_primary_vet_id_fkey"
            columns: ["primary_vet_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string
          email: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          email: string
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
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
          grooming_id: string | null
          id: string
          pet_owner_id: string
          rating: number
          updated_at: string | null
          veterinarian_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          grooming_id?: string | null
          id?: string
          pet_owner_id: string
          rating: number
          updated_at?: string | null
          veterinarian_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          grooming_id?: string | null
          id?: string
          pet_owner_id?: string
          rating?: number
          updated_at?: string | null
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_grooming_id_fkey"
            columns: ["grooming_id"]
            isOneToOne: false
            referencedRelation: "pet_grooming"
            referencedColumns: ["id"]
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
      treatment_cases: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          diagnosis: string
          id: string
          instructions_for_owner: string | null
          pet_id: string
          start_date: string
          veterinarian_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          diagnosis: string
          id?: string
          instructions_for_owner?: string | null
          pet_id: string
          start_date?: string
          veterinarian_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          diagnosis?: string
          id?: string
          instructions_for_owner?: string | null
          pet_id?: string
          start_date?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_cases_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_cases_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_cases_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_medications: {
        Row: {
          created_at: string | null
          dosage: string
          duration_days: number
          first_dose_at: string | null
          frequency_hours: number
          id: string
          instructions: string | null
          medication: string
          start_date: string
          treatment_case_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          duration_days: number
          first_dose_at?: string | null
          frequency_hours: number
          id?: string
          instructions?: string | null
          medication: string
          start_date?: string
          treatment_case_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          duration_days?: number
          first_dose_at?: string | null
          frequency_hours?: number
          id?: string
          instructions?: string | null
          medication?: string
          start_date?: string
          treatment_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_medications_treatment_case_id_fkey"
            columns: ["treatment_case_id"]
            isOneToOne: false
            referencedRelation: "treatment_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccination_records: {
        Row: {
          administered_by: string | null
          anatomical_site: string | null
          application_date: string
          created_at: string | null
          id: string
          lot_expiry_date: string | null
          lot_number: string | null
          manufacturer: string | null
          needs_booster: boolean | null
          next_due_date: string | null
          notes: string | null
          pet_id: string
          route: string | null
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          anatomical_site?: string | null
          application_date: string
          created_at?: string | null
          id?: string
          lot_expiry_date?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          needs_booster?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          route?: string | null
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          anatomical_site?: string | null
          application_date?: string
          created_at?: string | null
          id?: string
          lot_expiry_date?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          needs_booster?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          route?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_documents: {
        Row: {
          document_url: string
          id: string
          notes: string | null
          pet_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          document_url: string
          id?: string
          notes?: string | null
          pet_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          document_url?: string
          id?: string
          notes?: string | null
          pet_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccine_documents_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_medical_records: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          pet_id: string
          title: string
          veterinarian_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          date?: string
          description: string
          id?: string
          pet_id: string
          title: string
          veterinarian_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          pet_id?: string
          title?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_medical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_medical_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_medical_records_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_personal_notes: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          id: string
          title: string | null
          updated_at: string | null
          veterinarian_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          veterinarian_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_personal_notes_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_pet_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          pet_id: string
          updated_at: string | null
          veterinarian_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          pet_id: string
          updated_at?: string | null
          veterinarian_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          pet_id?: string
          updated_at?: string | null
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_pet_notes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_pet_notes_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
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
          clinic_address: string | null
          clinic_latitude: number | null
          clinic_longitude: number | null
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
          clinic_address?: string | null
          clinic_latitude?: number | null
          clinic_longitude?: number | null
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
          clinic_address?: string | null
          clinic_latitude?: number | null
          clinic_longitude?: number | null
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
      v_medical_history: {
        Row: {
          diagnosis: string | null
          event_date: string | null
          event_id: string | null
          instructions_for_owner: string | null
          meds_summary: string | null
          note_text: string | null
          pet_id: string | null
          vet_id: string | null
          vet_name: string | null
        }
        Relationships: []
      }
      v_treatment_medications: {
        Row: {
          created_at: string | null
          days_left: number | null
          dosage: string | null
          duration_days: number | null
          first_dose_at: string | null
          frequency_hours: number | null
          id: string | null
          instructions: string | null
          is_active: boolean | null
          medication: string | null
          next_dose_at: string | null
          start_date: string | null
          treatment_case_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_left?: never
          dosage?: string | null
          duration_days?: number | null
          first_dose_at?: string | null
          frequency_hours?: number | null
          id?: string | null
          instructions?: string | null
          is_active?: never
          medication?: string | null
          next_dose_at?: never
          start_date?: string | null
          treatment_case_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_left?: never
          dosage?: string | null
          duration_days?: number | null
          first_dose_at?: string | null
          frequency_hours?: number | null
          id?: string | null
          instructions?: string | null
          is_active?: never
          medication?: string | null
          next_dose_at?: never
          start_date?: string | null
          treatment_case_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_medications_treatment_case_id_fkey"
            columns: ["treatment_case_id"]
            isOneToOne: false
            referencedRelation: "treatment_cases"
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
      get_or_create_conversation: {
        Args: { user1_uuid: string; user2_uuid: string }
        Returns: string
      }
      send_message: {
        Args: {
          conversation_uuid: string
          sender_uuid: string
          receiver_uuid: string
          message_text: string
        }
        Returns: string
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
      owner_med_category: "cronico" | "suplemento"
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
      owner_med_category: ["cronico", "suplemento"],
      payment_status: ["pendiente", "pagado", "reembolsado", "parcial"],
    },
  },
} as const
