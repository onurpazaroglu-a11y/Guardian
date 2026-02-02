import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserTier } from '@/types';
import { createBrowserClient } from '@/lib/supabase';

interface AuthState {
    user: User | null;
    tier: UserTier;
    isLoading: boolean;
    apiKeys: {
        binance_api_key?: string;
        binance_secret?: string;
    } | null;
    setUser: (user: User | null) => void;
    setTier: (tier: UserTier) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
    setApiKeys: (keys: { binance_api_key: string; binance_secret: string } | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tier: 'free',
            isLoading: true,
            apiKeys: null,

            setUser: (user) => set({ user, tier: user?.tier || 'free' }),

            setTier: (tier) => set({ tier }),

            signIn: async (email, password) => {
                // Mock login for now
                set({ isLoading: true });

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockUser: User = {
                    id: 'mock-user-id',
                    email: email,
                    tier: 'free',
                    created_at: new Date().toISOString(),
                };

                set({ user: mockUser, tier: 'free', isLoading: false });
            },

            setApiKeys: (keys) => set({ apiKeys: keys }),

            signOut: async () => {
                try {
                    const supabase = createBrowserClient();
                    await supabase.auth.signOut();
                } catch (e) {
                    console.error('Supabase signOut error (expected if not configured):', e);
                }
                set({ user: null, tier: 'free', apiKeys: null });
            },

            checkSession: async () => {
                try {
                    const supabase = createBrowserClient();
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        // Fetch user profile from DB
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                                tier: profile?.tier || 'free',
                                created_at: session.user.created_at,
                            },
                            tier: profile?.tier || 'free',
                            isLoading: false,
                        });
                    } else {
                        set({ isLoading: false });
                    }
                } catch (e) {
                    console.error('Supabase session check error (expected if not configured):', e);
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'guardian-auth',
            // Persistence is good for mock testing
        }
    )
);