import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    UserPlus, 
    UserCheck, 
    ClipboardCheck, 
    Users, 
    Calendar,
    BarChart3
} from "lucide-react";

const actions = [
    {
        label: "Check-In",
        icon: ClipboardCheck,
        href: "CheckIn",
        color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
        label: "Add Member",
        icon: UserPlus,
        href: "Members?action=add",
        color: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    {
        label: "Add Visitor",
        icon: UserCheck,
        href: "Visitors?action=add",
        color: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    {
        label: "View Members",
        icon: Users,
        href: "Members",
        color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    },
    {
        label: "Services",
        icon: Calendar,
        href: "Services",
        color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "Reports",
        color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    },
];

export default function QuickActions() {
    return (
        <Card className="border-slate-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <Link key={action.label} to={createPageUrl(action.href)}>
                        <Button 
                            className={`w-full justify-start gap-2 ${action.color}`}
                            variant="ghost"
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}