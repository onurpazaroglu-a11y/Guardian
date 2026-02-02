'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
    const { user, tier, isLoading, checkSession, signOut } = useAuthStore();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return {
        user,
        tier,
        isLoading,
        isAuthenticated: !!user,
        isPro: tier === 'pro',
        signOut,
    };
}