import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UpgradePrompt() {
    return (
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Pro'ya Yükseltin</h3>
                        <p className="text-sm text-muted-foreground">
                            Daha düşük timeframeler ve anlık bildirimler için Pro plana geçin.
                        </p>
                    </div>
                </div>
                <Link href="/dashboard/settings">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Detayları Gör
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
    )
}
