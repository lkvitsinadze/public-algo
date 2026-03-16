// Manual type definitions matching the Supabase schema.
// Regenerate with: supabase gen types typescript --project-id <id> > src/types/database.ts

export type SystemDomain = 'welfare' | 'policing' | 'immigration' | 'border' | 'public_services' | 'other'
export type SystemSource = 'dutch_register' | 'community' | 'foi_response'
export type SystemStatus = 'confirmed' | 'unverified'
export type EuRiskCategory = 'high' | 'limited' | 'minimal' | 'unclassified'
export type FoiRequestStatus = 'sent' | 'responded' | 'no_response' | 'withdrawn'

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          user_id: string
          name: string
          country: string
          organisation: string | null
          role: 'user' | 'moderator' | 'admin'
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          country?: string
          organisation?: string | null
          role?: 'user' | 'moderator' | 'admin'
          created_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          country?: string
          organisation?: string | null
          role?: 'user' | 'moderator' | 'admin'
        }
        Relationships: []
      }
      organisations: {
        Row: {
          org_id: string
          name: string
          country: string
          sector: string | null
          website: string | null
          foi_email: string | null
          created_at: string
        }
        Insert: {
          org_id?: string
          name: string
          country: string
          sector?: string | null
          website?: string | null
          foi_email?: string | null
          created_at?: string
        }
        Update: {
          org_id?: string
          name?: string
          country?: string
          sector?: string | null
          website?: string | null
          foi_email?: string | null
        }
        Relationships: []
      }
      algorithm_systems: {
        Row: {
          system_id: string
          name: string
          org_id: string
          country: string
          domain: SystemDomain
          description: string | null
          vendor: string | null
          deployment_date: string | null
          source: SystemSource
          status: SystemStatus
          eu_risk_category: EuRiskCategory
          created_at: string
          updated_at: string
        }
        Insert: {
          system_id?: string
          name: string
          org_id: string
          country: string
          domain?: SystemDomain
          description?: string | null
          vendor?: string | null
          deployment_date?: string | null
          source?: SystemSource
          status?: SystemStatus
          eu_risk_category?: EuRiskCategory
          created_at?: string
          updated_at?: string
        }
        Update: {
          system_id?: string
          name?: string
          org_id?: string
          country?: string
          domain?: SystemDomain
          description?: string | null
          vendor?: string | null
          deployment_date?: string | null
          source?: SystemSource
          status?: SystemStatus
          eu_risk_category?: EuRiskCategory
        }
        Relationships: [
          {
            foreignKeyName: "algorithm_systems_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["org_id"]
          }
        ]
      }
      foi_templates: {
        Row: {
          template_id: string
          country: string
          language: string
          subject_line: string
          legal_basis: string
          body: string
          system_name_placeholder: boolean
          active: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          template_id?: string
          country: string
          language: string
          subject_line: string
          legal_basis: string
          body: string
          system_name_placeholder?: boolean
          active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          template_id?: string
          country?: string
          language?: string
          subject_line?: string
          legal_basis?: string
          body?: string
          system_name_placeholder?: boolean
          active?: boolean
          version?: number
        }
        Relationships: []
      }
      foi_requests: {
        Row: {
          request_id: string
          org_id: string
          template_id: string
          country: string
          submitted_by: string
          subject_line: string
          legal_basis: string
          body_final: string
          system_name: string | null
          sender_name: string
          sender_email: string
          sender_organisation: string | null
          status: FoiRequestStatus
          submitted_date: string
          response_date: string | null
          public: boolean
        }
        Insert: {
          request_id?: string
          org_id: string
          template_id: string
          country: string
          submitted_by: string
          subject_line: string
          legal_basis: string
          body_final: string
          system_name?: string | null
          sender_name: string
          sender_email: string
          sender_organisation?: string | null
          status?: FoiRequestStatus
          submitted_date?: string
          response_date?: string | null
          public?: boolean
        }
        Update: {
          status?: FoiRequestStatus
          response_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foi_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "foi_requests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "foi_templates"
            referencedColumns: ["template_id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      system_domain: SystemDomain
      system_source: SystemSource
      system_status: SystemStatus
      eu_risk_category: EuRiskCategory
      foi_request_status: FoiRequestStatus
    }
    CompositeTypes: Record<string, never>
  }
}

// Convenience row types
export type Organisation = Database['public']['Tables']['organisations']['Row']
export type AlgorithmSystem = Database['public']['Tables']['algorithm_systems']['Row']
export type FoiTemplate = Database['public']['Tables']['foi_templates']['Row']
export type FoiRequest = Database['public']['Tables']['foi_requests']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

// Join types used in the UI
export type AlgorithmSystemWithOrg = AlgorithmSystem & {
  organisations: Pick<Organisation, 'name' | 'country' | 'sector' | 'website'>
}

export type FoiRequestWithOrg = FoiRequest & {
  organisations: Pick<Organisation, 'name' | 'country'>
}
