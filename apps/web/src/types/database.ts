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
                    created_at: string
                    email: string | null
                    first_name: string | null
                    last_name: string | null
                    avatar_url: string | null
                    tier: 'free' | 'signal' | 'blocker' | 'bundle'
                    preferred_market: string | null
                    api_key: string | null
                    api_secret: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    email?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    tier?: 'free' | 'signal' | 'blocker' | 'bundle'
                    preferred_market?: string | null
                    api_key?: string | null
                    api_secret?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    tier?: 'free' | 'signal' | 'blocker' | 'bundle'
                    preferred_market?: string | null
                    api_key?: string | null
                    api_secret?: string | null
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    created_at: string
                    plan_name: string
                    amount: number
                    currency: string
                    status: 'completed' | 'pending' | 'failed' | 'refunded'
                    invoice_url: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    created_at?: string
                    plan_name: string
                    amount: number
                    currency?: string
                    status?: 'completed' | 'pending' | 'failed' | 'refunded'
                    invoice_url?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    created_at?: string
                    plan_name?: string
                    amount?: number
                    currency?: string
                    status?: 'completed' | 'pending' | 'failed' | 'refunded'
                    invoice_url?: string | null
                }
            }
            logs: {
                Row: {
                    id: string
                    user_id: string
                    created_at: string
                    log_type: 'success' | 'error' | 'warning' | 'info'
                    message: string
                    details: string | null
                    source: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    created_at?: string
                    log_type: 'success' | 'error' | 'warning' | 'info'
                    message: string
                    details?: string | null
                    source?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    created_at?: string
                    log_type?: 'success' | 'error' | 'warning' | 'info'
                    message?: string
                    details?: string | null
                    source?: string | null
                }
            }
        }
    }
}
