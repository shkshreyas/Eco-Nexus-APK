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
      alerts: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          severity: 'low' | 'medium' | 'high'
          user_id: string | null
          is_read: boolean
          metadata: Json | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          severity: 'low' | 'medium' | 'high'
          user_id?: string | null
          is_read?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          severity?: 'low' | 'medium' | 'high'
          user_id?: string | null
          is_read?: boolean
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      energy_readings: {
        Row: {
          id: number
          created_at: string
          timestamp: string
          value: number
          user_id: string | null
          source: string
          description: string | null
          location: string | null
          device_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          timestamp: string
          value: number
          user_id?: string | null
          source: string
          description?: string | null
          location?: string | null
          device_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          timestamp?: string
          value?: number
          user_id?: string | null
          source?: string
          description?: string | null
          location?: string | null
          device_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_readings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      drone_scans: {
        Row: {
          id: number
          created_at: string
          timestamp: string
          location: string
          scan_data: Json
          user_id: string | null
          drone_id: string | null
          description: string | null
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          timestamp: string
          location: string
          scan_data: Json
          user_id?: string | null
          drone_id?: string | null
          description?: string | null
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          timestamp?: string
          location?: string
          scan_data?: Json
          user_id?: string | null
          drone_id?: string | null
          description?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "drone_scans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          email: string | null
          bio: string | null
          location: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          bio?: string | null
          location?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          bio?: string | null
          location?: string | null
          preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 