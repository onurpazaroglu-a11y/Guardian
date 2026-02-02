import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Geçerli bir email girin'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

export const analysisSchema = z.object({
    symbol: z.string().regex(/^[A-Z]{5,10}$/, 'Geçersiz sembol formatı'),
    interval: z.string(),
    strategy: z.enum(['breakout', 'pullback', 'continuation']),
});

export const apiKeySchema = z.object({
    binanceApiKey: z.string().min(10, 'API Key gereklidir'),
    binanceSecret: z.string().min(10, 'Secret Key gereklidir'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AnalysisInput = z.infer<typeof analysisSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;