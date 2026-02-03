"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, CreditCard, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Define the Order type based on our DB schema
interface Order {
    id: string;
    created_at: string;
    plan_name: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    invoice_url: string | null;
}

export default function OrdersPage() {
    const { user } = useAuth();
    const supabase = createBrowserClient();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    setOrders(data || []);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, supabase]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return "bg-green-500/10 text-green-500 border-green-500/20";
            case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case 'failed': return "bg-red-500/10 text-red-500 border-red-500/20";
            case 'refunded': return "bg-gray-500/10 text-gray-500 border-gray-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return "Tamamlandı";
            case 'pending': return "Beklemede";
            case 'failed': return "Başarısız";
            case 'refunded': return "İade Edildi";
            default: return status;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight gradient-text w-fit">Alışveriş Geçmişi</h1>
                <p className="text-muted-foreground">Geçmiş ödemeleriniz ve faturalarınız.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Siparişler
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                                <p>Henüz bir siparişiniz bulunmuyor.</p>
                            </div>
                        ) : (
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b [&_tr]:border-white/5">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Sipariş No</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Paket / Ürün</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tarih</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tutar</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Durum</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group">
                                            <td className="p-4 align-middle font-medium font-mono text-xs text-muted-foreground">
                                                {order.id.slice(0, 8)}...
                                            </td>
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                                        <CreditCard className="h-4 w-4 text-primary" />
                                                    </div>
                                                    {order.plan_name}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(order.created_at), 'd MMMM yyyy, HH:mm', { locale: tr })}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle font-bold text-white">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: order.currency }).format(order.amount)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                                    {getStatusText(order.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                {order.invoice_url && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                                        <a href={order.invoice_url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
