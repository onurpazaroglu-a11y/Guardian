import { createBrowserClient } from "@/lib/supabase";

interface CreateLogParams {
    userId: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    details?: string;
    source?: string;
}

export async function createLog({ userId, type, message, details, source }: CreateLogParams) {
    const supabase = createBrowserClient();

    try {
        const { error } = await supabase
            .from('logs')
            .insert({
                user_id: userId,
                log_type: type,
                message,
                details: details || null,
                source: source || null,
            });

        if (error) {
            console.error('Error creating log:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Unexpected error creating log:', error);
        return false;
    }
}
