export type Database = {
  public: {
    Tables: {
      event_catalog: {
        Row: {
          id: string;
          title: string;
          capacity: number;
          registration_deadline: string;
          event_type: 'event' | 'hackathon';
          team_size_min: number | null;
          team_size_max: number | null;
          theme: string | null;
          prize: string | null;
          rules: string[];
        };
        Insert: {
          id: string;
          title: string;
          capacity: number;
          registration_deadline: string;
          event_type?: 'event' | 'hackathon';
          team_size_min?: number | null;
          team_size_max?: number | null;
          theme?: string | null;
          prize?: string | null;
          rules?: string[];
        };
        Update: Partial<Database['public']['Tables']['event_catalog']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          course_year: string | null;
          role: 'student' | 'organizer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          course_year?: string | null;
          role?: 'student' | 'organizer';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      event_registrations: {
        Row: { id: string; event_id: string; user_id: string; registered_at: string };
        Insert: { id?: string; event_id: string; user_id: string; registered_at?: string };
        Update: Partial<Database['public']['Tables']['event_registrations']['Insert']>;
        Relationships: [];
      };
      event_announcements: {
        Row: {
          id: string;
          event_id: string;
          author_id: string;
          author_name: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          author_id: string;
          author_name: string;
          message: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_announcements']['Insert']>;
        Relationships: [];
      };
      event_teams: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          leader_id: string;
          leader_email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          leader_id: string;
          leader_email: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_teams']['Insert']>;
        Relationships: [];
      };
      event_team_members: {
        Row: {
          id: string;
          event_id: string;
          team_id: string;
          member_email: string;
          email_key: string;
          created_at: string;
        };
        Insert: {
          id?: string; event_id: string; team_id: string; member_email: string; created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_team_members']['Insert']>;
        Relationships: [];
      };
      event_attendance: {
        Row: {
          event_id: string; user_id: string; status: 'present' | 'absent'; updated_at: string;
        };
        Insert: {
          event_id: string; user_id: string; status: 'present' | 'absent'; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_attendance']['Insert']>;
        Relationships: [];
      };
      event_certificates: {
        Row: {
          id: string; event_id: string; user_id: string; issued_at: string;
        };
        Insert: { id?: string; event_id: string; user_id: string; issued_at?: string };
        Update: Partial<Database['public']['Tables']['event_certificates']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_event_registration_statuses: {
        Args: { p_event_ids: string[] };
        Returns: {
          event_id: string;
          capacity: number;
          registration_deadline: string;
          seats_left: number;
          is_registered: boolean;
          registration_open: boolean;
        }[];
      };
      register_for_event: {
        Args: { p_event_id: string };
        Returns: {
          result: string;
          seats_left: number;
          capacity: number;
          registration_deadline: string;
        }[];
      };
      cancel_event_registration: {
        Args: { p_event_id: string };
        Returns: boolean;
      };
      create_hackathon_team: {
        Args: { p_event_id: string; p_name: string; p_member_emails: string[] };
        Returns: string;
      };
      verify_certificate: {
        Args: { p_certificate_id: string };
        Returns: {
          certificate_id: string;
          event_id: string;
          event_title: string;
          attendee_name: string;
          issued_at: string;
          is_valid: boolean;
        }[];
      };
      issue_event_certificate: {
        Args: { p_event_id: string; p_user_id: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
