import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
    const today = new Date();
    const weekStart = format(startOfWeek(today), "yyyy-MM-dd");
    const weekEnd = format(endOfWeek(today), "yyyy-MM-dd");

    const { data: members = [], isLoading: loadingMembers } = useQuery({
        queryKey: ["members"],
        queryFn: () => base44.entities.Member.list(),
    });

    const { data: visitors = [], isLoading: loadingVisitors } = useQuery({
        queryKey: ["visitors"],
        queryFn: () => base44.entities.Visitor.list(),
    });

    const { data: attendance = [], isLoading: loadingAttendance } = useQuery({
        queryKey: ["attendance"],
        queryFn: () => base44.entities.Attendance.list("-created_date", 50),
    });

    const { data: services = [], isLoading: loadingServices } = useQuery({
        queryKey: ["services"],
        queryFn: () => base44.entities.Service.list("-service_date", 10),
    });

    const { data: events = [], isLoading: loadingEvents } = useQuery({
        queryKey: ["events"],
        queryFn: () => base44.entities.Event.list("-event_date", 5),
    });

    const isLoading = loadingMembers || loadingVisitors || loadingAttendance;

    // Calculate stats
    const activeMembers = members.filter(m => m.is_active !== false).length;
    const thisWeekAttendance = attendance.filter(a => 
        a.service_date >= weekStart && a.service_date <= weekEnd
    );
    const todayAttendance = attendance.filter(a => 
        a.service_date === format(today, "yyyy-MM-dd")
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-amber-50/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Church Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-amber-600 shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
                    </div>
                    
                    <div className="relative px-6 md:px-12 py-8 md:py-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Church Logo/Icon */}
                            <div className="flex-shrink-0">
                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    <svg 
                                        className="h-12 w-12 md:h-14 md:w-14 text-white" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={1.5} 
                                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Church Info */}
                            <div className="flex-1 text-white space-y-3">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold mb-1">
                                        House of Glory Church
                                    </h1>
                                    <p className="text-purple-100 text-lg md:text-xl font-medium italic">
                                        "Where Faith Meets Purpose"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                                    {/* Vision */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="h-5 w-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm uppercase tracking-wide text-purple-100 mb-1">
                                                    Our Vision
                                                </h3>
                                                <p className="text-white text-sm leading-relaxed">
                                                    To build a generation of believers who walk in faith, love, and the fullness of God's glory.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mission */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="h-5 w-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm uppercase tracking-wide text-purple-100 mb-1">
                                                    Our Mission
                                                </h3>
                                                <p className="text-white text-sm leading-relaxed">
                                                    To spread the gospel, nurture disciples, and serve our community with the love of Christ.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Date */}
                        <div className="mt-6 pt-4 border-t border-white/20">
                            <p className="text-white/80 text-sm">
                                {format(today, "EEEE, MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))
                    ) : (
                        <>
                            <StatCard
                                title="Total Members"
                                value={activeMembers}
                                subtitle={`${members.length - activeMembers} inactive`}
                                icon={Users}
                                color="purple"
                            />
                            <StatCard
                                title="Total Visitors"
                                value={visitors.length}
                                subtitle="All time"
                                icon={UserPlus}
                                color="gold"
                            />
                            <StatCard
                                title="Today's Attendance"
                                value={todayAttendance.length}
                                subtitle={format(today, "MMM d")}
                                icon={Calendar}
                                color="emerald"
                            />
                            <StatCard
                                title="This Week"
                                value={thisWeekAttendance.length}
                                subtitle="Total check-ins"
                                icon={TrendingUp}
                                color="blue"
                            />
                        </>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <RecentActivity attendance={attendance} />
                    </div>
                    
                    {/* Quick Actions */}
                    <div>
                        <QuickActions />
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['adult', 'youth', 'teenager', 'child', 'senior'].map((category) => {
                        const count = members.filter(m => m.category === category).length;
                        const colors = {
                            adult: 'from-purple-500 to-purple-600',
                            youth: 'from-blue-500 to-blue-600',
                            teenager: 'from-cyan-500 to-cyan-600',
                            child: 'from-pink-500 to-pink-600',
                            senior: 'from-amber-500 to-amber-600',
                        };
                        return (
                            <div 
                                key={category}
                                className={`bg-gradient-to-br ${colors[category]} rounded-xl p-4 text-white`}
                            >
                                <p className="text-white/80 text-sm capitalize">{category}s</p>
                                <p className="text-2xl font-bold mt-1">{count}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 text-lg">Upcoming Events</h3>
                        <Link to={createPageUrl("Events")}>
                            <Button variant="ghost" size="sm" className="text-purple-600">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {events.filter(e => new Date(e.event_date) >= new Date() && e.is_active).slice(0, 3).map((event) => (
                            <div key={event.id} className="p-3 bg-gradient-to-r from-purple-50 to-emerald-50 rounded-lg border border-purple-100">
                                <h4 className="font-medium text-slate-800 mb-1">{event.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(event.event_date), "MMM d")}
                                    </span>
                                    <span>{event.start_time}</span>
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {events.filter(e => new Date(e.event_date) >= new Date() && e.is_active).length === 0 && (
                            <p className="text-center text-slate-400 py-8 text-sm">No upcoming events</p>
                        )}
                    </div>
                </div>

                {/* Spiritual Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Salvation Status */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Salvation Status</h3>
                        <div className="space-y-3">
                            {['saved', 'not_saved', 'rededicated'].map((status) => {
                                const count = members.filter(m => m.salvation_status === status).length;
                                const percent = members.length ? Math.round((count / members.length) * 100) : 0;
                                const colors = {
                                    saved: 'bg-emerald-500',
                                    not_saved: 'bg-slate-300',
                                    rededicated: 'bg-purple-500',
                                };
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize text-slate-600">
                                                {status.replace('_', ' ')}
                                            </span>
                                            <span className="font-medium text-slate-800">{count}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${colors[status]} rounded-full transition-all duration-500`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Baptism Status */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Baptism Status</h3>
                        <div className="space-y-3">
                            {['baptized', 'not_baptized', 'scheduled'].map((status) => {
                                const count = members.filter(m => m.baptism_status === status).length;
                                const percent = members.length ? Math.round((count / members.length) * 100) : 0;
                                const colors = {
                                    baptized: 'bg-blue-500',
                                    not_baptized: 'bg-slate-300',
                                    scheduled: 'bg-amber-500',
                                };
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize text-slate-600">
                                                {status.replace('_', ' ')}
                                            </span>
                                            <span className="font-medium text-slate-800">{count}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${colors[status]} rounded-full transition-all duration-500`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}