import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    LayoutDashboard, 
    Users, 
    UserPlus, 
    ClipboardCheck, 
    Calendar,
    BarChart3,
    Menu,
    X,
    Church,
    Mail,
    Megaphone,
    HeartHandshake,
    CalendarDays,
    Heart,
    Target
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "Dashboard", icon: LayoutDashboard },
    { name: "Check-In", href: "CheckIn", icon: ClipboardCheck },
    { name: "Members", href: "Members", icon: Users },
    { name: "Visitors", href: "Visitors", icon: UserPlus },
    { name: "Ministries", href: "Ministries", icon: HeartHandshake },
    { name: "Events", href: "Events", icon: CalendarDays },
    { name: "Services", href: "Services", icon: Calendar },
    { name: "Donate", href: "Donate", icon: Heart },
    { name: "Pledges", href: "Pledges", icon: Target },
    { name: "Giving History", href: "DonationHistory", icon: Heart },
    { name: "AI Analytics", href: "DonationAnalytics", icon: BarChart3 },
    { name: "Messages", href: "Messages", icon: Mail },
    { name: "Announcements", href: "Announcements", icon: Megaphone },
    { name: "Reports", href: "Reports", icon: BarChart3 },
];

export default function Layout({ children, currentPageName }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                        <Church className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800">Church Register</h1>
                        <p className="text-xs text-slate-400">Attendance System</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = currentPageName === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={createPageUrl(item.href)}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    isActive 
                                        ? "bg-purple-50 text-purple-700" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-purple-600" : "text-slate-400"
                                )} />
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                    <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Quick Tip
                        </p>
                        <p className="text-sm text-slate-600">
                            Use the Check-In page for fast member registration using their unique ID.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-4 lg:hidden">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Church className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-800">Church Register</span>
                    </div>
                    <div className="w-10" />
                </header>

                {/* Page content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}