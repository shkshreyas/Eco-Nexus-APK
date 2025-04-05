export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          avatar_url: string
          location: string
          bio: string
          green_points: number
          trees_planted: number
          lives_impacted: number
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          avatar_url?: string
          location?: string
          bio?: string
          green_points?: number
          trees_planted?: number
          lives_impacted?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          avatar_url?: string
          location?: string
          bio?: string
          green_points?: number
          trees_planted?: number
          lives_impacted?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          image_url: string
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          image_url?: string
          likes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          image_url?: string
          likes_count?: number
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          content?: string
          created_at?: string
        }
      }
      disaster_zones: {
        Row: {
          id: string
          name: string
          description: string | null
          lat: number
          lng: number
          intensity: number
          disaster_type: string
          radius_meters: number
          active: boolean
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          lat: number
          lng: number
          intensity: number
          disaster_type: string
          radius_meters: number
          active?: boolean
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          lat?: number
          lng?: number
          intensity?: number
          disaster_type?: string
          radius_meters?: number
          active?: boolean
          timestamp?: string
          created_at?: string
        }
      }
      ewaste_items: {
        Row: {
          id: string
          user_id: string | null
          item_type: string
          description: string | null
          weight_kg: number | null
          qr_code: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          item_type: string
          description?: string | null
          weight_kg?: number | null
          qr_code: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          item_type?: string
          description?: string | null
          weight_kg?: number | null
          qr_code?: string
          status?: string
          created_at?: string
        }
      }
      ewaste_recycling_events: {
        Row: {
          id: string
          item_id: string
          user_id: string
          location: string | null
          lat: number | null
          lng: number | null
          points_awarded: number
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          location?: string | null
          lat?: number | null
          lng?: number | null
          points_awarded?: number
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          location?: string | null
          lat?: number | null
          lng?: number | null
          points_awarded?: number
          created_at?: string
        }
      }
      forest_data: {
        Row: {
          id: string
          region_name: string
          lat: number
          lng: number
          area_hectares: number
          tree_count: number | null
          health: number
          co2_absorption: number
          deforestation_risk: number | null
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          region_name: string
          lat: number
          lng: number
          area_hectares: number
          tree_count?: number | null
          health: number
          co2_absorption: number
          deforestation_risk?: number | null
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          region_name?: string
          lat?: number
          lng?: number
          area_hectares?: number
          tree_count?: number | null
          health?: number
          co2_absorption?: number
          deforestation_risk?: number | null
          last_updated?: string
          created_at?: string
        }
      }
      drone_scans: {
        Row: {
          id: string
          user_id: string
          mission_name: string
          scan_area_name: string
          lat: number
          lng: number
          altitude_meters: number | null
          image_url: string | null
          findings: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mission_name: string
          scan_area_name: string
          lat: number
          lng: number
          altitude_meters?: number | null
          image_url?: string | null
          findings?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mission_name?: string
          scan_area_name?: string
          lat?: number
          lng?: number
          altitude_meters?: number | null
          image_url?: string | null
          findings?: string | null
          created_at?: string
        }
      }
      energy_readings: {
        Row: {
          id: string
          user_id: string
          reading_value: number
          reading_type: string
          source: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reading_value: number
          reading_type: string
          source?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reading_value?: number
          reading_type?: string
          source?: string | null
          timestamp?: string
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          title: string
          description: string | null
          alert_type: string
          severity: string
          lat: number | null
          lng: number | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          alert_type: string
          severity: string
          lat?: number | null
          lng?: number | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          alert_type?: string
          severity?: string
          lat?: number | null
          lng?: number | null
          is_read?: boolean
          created_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          title: string
          description: string
          reward_points: number
          difficulty: string
          status: string
          expiry_date: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          reward_points: number
          difficulty: string
          status?: string
          expiry_date?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          reward_points?: number
          difficulty?: string
          status?: string
          expiry_date?: string | null
          user_id?: string
          created_at?: string
        }
      }
      quest_submissions: {
        Row: {
          id: string
          quest_id: string
          user_id: string
          submission_text: string
          submission_url: string | null
          status: string
          points_awarded: number | null
          created_at: string
        }
        Insert: {
          id?: string
          quest_id: string
          user_id: string
          submission_text: string
          submission_url?: string | null
          status?: string
          points_awarded?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          quest_id?: string
          user_id?: string
          submission_text?: string
          submission_url?: string | null
          status?: string
          points_awarded?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_recycle: {
        Args: {
          item_id: string
          user_id: string
        }
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