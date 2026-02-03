export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'engineer' | 'company' | 'admin'
export type EngagementType = 'freelance' | 'sidejob' | 'fulltime'
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed'
export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'accepted' | 'rejected' | 'withdrawn'
export type ContractStatus = 'initiated' | 'signed' | 'active' | 'completed' | 'cancelled'
export type InvoiceStatus = 'pending' | 'paid' | 'void' | 'failed'
export type NotificationType = 'application' | 'message' | 'contract' | 'system' | 'scout'
export type ScoutStatus = 'sent' | 'viewed' | 'replied' | 'declined'

// Monitor Program types
export type MonitorRole = 'owner' | 'admin' | 'staff' | 'viewer'
export type MonitorSessionStatus =
  | 'applied'
  | 'scheduling'
  | 'interview_waiting'
  | 'interviewed'
  | 'screening'
  | 'decided'
  | 'dropped'
  | 'started'
  | 'basic_info'
  | 'recording'
  | 'transcribing'
  | 'generating'
  | 'reviewing'
  | 'completed'
  | 'abandoned'
export type MonitorSessionSource = 'public' | 'company_hearing' | 'apply_form'
export type MonitorConsentType = 'data_collection' | 'ai_processing' | 'anonymized_ml'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          display_name: string
          email: string | null
          avatar_url: string | null
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: UserRole
          display_name: string
          email?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          display_name?: string
          email?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
      }
      company_profiles: {
        Row: {
          id: string
          owner_id: string
          company_name: string
          website_url: string | null
          industry: string | null
          company_size: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          company_name: string
          website_url?: string | null
          industry?: string | null
          company_size?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          company_name?: string
          website_url?: string | null
          industry?: string | null
          company_size?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      engineer_profiles: {
        Row: {
          id: string
          owner_id: string
          headline: string | null
          bio: string | null
          years_of_experience: number | null
          location: string | null
          remote_ok: boolean
          availability_hours_per_week: number | null
          desired_engagement: EngagementType | null
          desired_min_monthly_yen: number | null
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          headline?: string | null
          bio?: string | null
          years_of_experience?: number | null
          location?: string | null
          remote_ok?: boolean
          availability_hours_per_week?: number | null
          desired_engagement?: EngagementType | null
          desired_min_monthly_yen?: number | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          headline?: string | null
          bio?: string | null
          years_of_experience?: number | null
          location?: string | null
          remote_ok?: boolean
          availability_hours_per_week?: number | null
          desired_engagement?: EngagementType | null
          desired_min_monthly_yen?: number | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
      }
      engineer_skill_links: {
        Row: {
          engineer_profile_id: string
          skill_id: string
          level: number
          years: number | null
        }
        Insert: {
          engineer_profile_id: string
          skill_id: string
          level?: number
          years?: number | null
        }
        Update: {
          engineer_profile_id?: string
          skill_id?: string
          level?: number
          years?: number | null
        }
      }
      job_posts: {
        Row: {
          id: string
          company_profile_id: string
          title: string
          description: string
          engagement: EngagementType
          status: JobStatus
          location: string | null
          remote_ok: boolean
          weekly_hours_min: number | null
          weekly_hours_max: number | null
          duration_months: number | null
          budget_min_monthly_yen: number | null
          budget_max_monthly_yen: number | null
          must_have: string | null
          nice_to_have: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_profile_id: string
          title: string
          description: string
          engagement: EngagementType
          status?: JobStatus
          location?: string | null
          remote_ok?: boolean
          weekly_hours_min?: number | null
          weekly_hours_max?: number | null
          duration_months?: number | null
          budget_min_monthly_yen?: number | null
          budget_max_monthly_yen?: number | null
          must_have?: string | null
          nice_to_have?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_profile_id?: string
          title?: string
          description?: string
          engagement?: EngagementType
          status?: JobStatus
          location?: string | null
          remote_ok?: boolean
          weekly_hours_min?: number | null
          weekly_hours_max?: number | null
          duration_months?: number | null
          budget_min_monthly_yen?: number | null
          budget_max_monthly_yen?: number | null
          must_have?: string | null
          nice_to_have?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_skill_links: {
        Row: {
          job_post_id: string
          skill_id: string
          weight: number
        }
        Insert: {
          job_post_id: string
          skill_id: string
          weight?: number
        }
        Update: {
          job_post_id?: string
          skill_id?: string
          weight?: number
        }
      }
      applications: {
        Row: {
          id: string
          job_post_id: string
          engineer_profile_id: string
          status: ApplicationStatus
          cover_letter: string | null
          match_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_post_id: string
          engineer_profile_id: string
          status?: ApplicationStatus
          cover_letter?: string | null
          match_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_post_id?: string
          engineer_profile_id?: string
          status?: ApplicationStatus
          cover_letter?: string | null
          match_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          job_post_id: string | null
          company_profile_id: string
          engineer_profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          job_post_id?: string | null
          company_profile_id: string
          engineer_profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          job_post_id?: string | null
          company_profile_id?: string
          engineer_profile_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_profile_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_profile_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_profile_id?: string
          body?: string
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          application_id: string | null
          company_profile_id: string
          engineer_profile_id: string
          status: ContractStatus
          start_date: string | null
          end_date: string | null
          monthly_fee_yen: number | null
          platform_fee_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          company_profile_id: string
          engineer_profile_id: string
          status?: ContractStatus
          start_date?: string | null
          end_date?: string | null
          monthly_fee_yen?: number | null
          platform_fee_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          company_profile_id?: string
          engineer_profile_id?: string
          status?: ContractStatus
          start_date?: string | null
          end_date?: string | null
          monthly_fee_yen?: number | null
          platform_fee_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      stripe_customers: {
        Row: {
          id: string
          profile_id: string
          stripe_customer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          stripe_customer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          stripe_customer_id?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          contract_id: string
          stripe_invoice_id: string | null
          amount_yen: number
          status: InvoiceStatus
          billing_month: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          stripe_invoice_id?: string | null
          amount_yen: number
          status?: InvoiceStatus
          billing_month?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          stripe_invoice_id?: string | null
          amount_yen?: number
          status?: InvoiceStatus
          billing_month?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_weights: {
        Row: {
          id: string
          key: string
          weight: number
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          weight?: number
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          weight?: number
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          profile_id: string
          type: NotificationType
          title: string
          body: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          type: NotificationType
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          type?: NotificationType
          title?: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          contract_id: string
          reviewer_profile_id: string
          reviewee_profile_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          reviewer_profile_id: string
          reviewee_profile_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          reviewer_profile_id?: string
          reviewee_profile_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      scouts: {
        Row: {
          id: string
          company_profile_id: string
          engineer_profile_id: string
          job_post_id: string | null
          message: string
          status: ScoutStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_profile_id: string
          engineer_profile_id: string
          job_post_id?: string | null
          message: string
          status?: ScoutStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_profile_id?: string
          engineer_profile_id?: string
          job_post_id?: string | null
          message?: string
          status?: ScoutStatus
          created_at?: string
          updated_at?: string
        }
      }
      // ─── Monitor Program Tables ───
      monitor_workspaces: {
        Row: {
          id: string
          company_name: string
          slug: string
          max_admin_accounts: number
          max_general_accounts: number
          max_api_calls_monthly: number
          max_storage_bytes: number
          is_active: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          slug: string
          max_admin_accounts?: number
          max_general_accounts?: number
          max_api_calls_monthly?: number
          max_storage_bytes?: number
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          slug?: string
          max_admin_accounts?: number
          max_general_accounts?: number
          max_api_calls_monthly?: number
          max_storage_bytes?: number
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      monitor_workspace_members: {
        Row: {
          id: string
          workspace_id: string
          profile_id: string
          monitor_role: MonitorRole
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          profile_id: string
          monitor_role?: MonitorRole
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          profile_id?: string
          monitor_role?: MonitorRole
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      monitor_sessions: {
        Row: {
          id: string
          workspace_id: string | null
          created_by_profile_id: string | null
          assigned_staff_id: string | null
          session_token: string
          status: MonitorSessionStatus
          source: string
          basic_info: Json | null
          transcript: string | null
          resume_data: Json | null
          template_id: string | null
          step_reached: number
          ai_calls_count: number
          pdf_downloaded: boolean
          consent_given_at: string | null
          consent_version: string | null
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          created_by_profile_id?: string | null
          assigned_staff_id?: string | null
          session_token: string
          status?: MonitorSessionStatus
          source?: string
          basic_info?: Json | null
          transcript?: string | null
          resume_data?: Json | null
          template_id?: string | null
          step_reached?: number
          ai_calls_count?: number
          pdf_downloaded?: boolean
          consent_given_at?: string | null
          consent_version?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          created_by_profile_id?: string | null
          assigned_staff_id?: string | null
          session_token?: string
          status?: MonitorSessionStatus
          source?: string
          basic_info?: Json | null
          transcript?: string | null
          resume_data?: Json | null
          template_id?: string | null
          step_reached?: number
          ai_calls_count?: number
          pdf_downloaded?: boolean
          consent_given_at?: string | null
          consent_version?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      monitor_templates: {
        Row: {
          id: string
          workspace_id: string | null
          name: string
          description: string | null
          template_type: string
          template_data: Json
          is_default: boolean
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          name: string
          description?: string | null
          template_type?: string
          template_data: Json
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          name?: string
          description?: string | null
          template_type?: string
          template_data?: Json
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      monitor_operation_logs: {
        Row: {
          id: string
          workspace_id: string | null
          actor_profile_id: string | null
          session_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          actor_profile_id?: string | null
          session_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          actor_profile_id?: string | null
          session_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
      monitor_consent_records: {
        Row: {
          id: string
          session_id: string | null
          profile_id: string | null
          session_token: string | null
          consent_type: string
          consented: boolean
          consent_version: string
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          profile_id?: string | null
          session_token?: string | null
          consent_type: string
          consented: boolean
          consent_version: string
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          profile_id?: string | null
          session_token?: string | null
          consent_type?: string
          consented?: boolean
          consent_version?: string
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Enums: {
      user_role: UserRole
      engagement_type: EngagementType
      job_status: JobStatus
      application_status: ApplicationStatus
      contract_status: ContractStatus
      invoice_status: InvoiceStatus
      notification_type: NotificationType
      scout_status: ScoutStatus
      monitor_role: MonitorRole
      monitor_session_status: MonitorSessionStatus
    }
  }
}
