import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserPlus, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ attendance = [] }) {
    const recentItems = attendance.slice(0, 8);

    const getIcon = (type) => {
        return type === 'member' ? UserCheck : UserPlus;
    };

    return (
        <Card className="border-slate-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800">
                    Recent Check-ins
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {recentItems.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-8">
                        No recent check-ins
                    </p>
                ) : (
                    recentItems.map((item, index) => {
                        const Icon = getIcon(item.person_type);
                        return (
                            <div
                                key={item.id || index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                            >
                                <div className={`rounded-full p-2 ${
                                    item.person_type === 'member' 
                                        ? 'bg-purple-100 text-purple-600' 
                                        : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">
                                        {item.person_name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {item.check_in_time || 'Just now'}
                                    </p>
                                </div>
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                        item.person_type === 'member'
                                            ? 'border-purple-200 text-purple-600 bg-purple-50'
                                            : 'border-amber-200 text-amber-600 bg-amber-50'
                                    }`}
                                >
                                    {item.person_type}
                                </Badge>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}