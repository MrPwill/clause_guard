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
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          track: string
          doc_type: string
          jurisdiction: string
          answers: Json
          content: string | null
          pdf_url: string | null
          signed_at: string | null
          signature: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          track: string
          doc_type: string
          jurisdiction: string
          answers?: Json
          content?: string | null
          pdf_url?: string | null
          signed_at?: string | null
          signature?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          track?: string
          doc_type?: string
          jurisdiction?: string
          answers?: Json
          content?: string | null
          pdf_url?: string | null
          signed_at?: string | null
          signature?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}