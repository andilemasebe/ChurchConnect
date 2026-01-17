import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "purple" }) {
    const colorClasses = {
        purple: "from-purple-500/10 to-purple-600/5 border-purple-100",
        gold: "from-amber-500/10 to-amber-600/5 border-amber-100",
        emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-100",
        blue: "from-blue-500/10 to-blue-600/5 border-blue-100",
    };

    const iconColorClasses = {
        purple: "bg-purple-100 text-purple-600",
        gold: "bg-amber-100 text-amber-600",
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
    };

    return (
        <Card className={cn(
            "relative overflow-hidden border bg-gradient-to-br p-6 transition-all hover:shadow-lg",
            colorClasses[color]
        )}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium",
                            trend > 0 ? "text-emerald-600" : "text-red-500"
                        )}>
                            {trend > 0 ? "+" : ""}{trend}% from last week
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn(
                        "rounded-xl p-3",
                        iconColorClasses[color]
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>
        </Card>
    );
}