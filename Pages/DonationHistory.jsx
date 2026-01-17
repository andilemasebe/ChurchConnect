import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, DollarSign, Calendar, TrendingUp, Filter, Loader2 } from "lucide-react";
import DonationReceiptCard from "../Components/donations/DonationReceiptCard";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DonationHistoryPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [filterFund, setFilterFund] = useState("all");
    const [filterType, setFilterType] = useState("all");

    React.useEffect(() => {
        base44.auth.me().then(user => setCurrentUser(user)).catch(() => {});
    }, []);

    const { data: donations, isLoading } = useQuery({
        queryKey: ['donations', currentUser?.email],
        queryFn: async () => {
            if (!currentUser) return [];
            const allDonations = await base44.entities.Donation.filter(
                { donor_email: currentUser.email },
                '-created_date'
            );
            return allDonations;
        },
        enabled: !!currentUser,
        initialData: [],
    });

    const filteredDonations = donations.filter(d => {
        const fundMatch = filterFund === "all" || d.fund === filterFund;
        const typeMatch = filterType === "all" || d.donation_type === filterType;
        return fundMatch && typeMatch;
    });

    // Calculate statistics
    const totalGiven = donations.reduce((sum, d) => sum + d.amount, 0);
    const thisYear = new Date().getFullYear();
    const yearlyGiven = donations
        .filter(d => new Date(d.created_date).getFullYear() === thisYear)
        .reduce((sum, d) => sum + d.amount, 0);
    const recurringDonations = donations.filter(d => d.donation_type !== "one_time").length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading your giving history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Giving History</h1>
                        <p className="text-slate-600">Track your donations and download receipts</p>
                    </div>
                    <Link to={createPageUrl('Donate')}>
                        <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                            <Heart className="mr-2 h-5 w-5" />
                            Make a Donation
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Given</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">
                                        R{totalGiven.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-slate-600">{donations.length} donations</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>This Year</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">
                                        R{yearlyGiven.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-slate-600">{thisYear} YTD</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Recurring Gifts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {recurringDonations}
                                    </p>
                                    <p className="text-sm text-slate-600">Active subscriptions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-slate-500" />
                            <CardTitle>Filter Donations</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-600 mb-2 block">Fund</label>
                                <Select value={filterFund} onValueChange={setFilterFund}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Funds</SelectItem>
                                        <SelectItem value="general">General Fund</SelectItem>
                                        <SelectItem value="building">Building Fund</SelectItem>
                                        <SelectItem value="missions">Missions</SelectItem>
                                        <SelectItem value="youth">Youth Ministry</SelectItem>
                                        <SelectItem value="worship">Worship & Arts</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600 mb-2 block">Type</label>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="one_time">One Time</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="annual">Annual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Donation List */}
                {filteredDonations.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No donations yet
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Start your giving journey today and make a difference
                            </p>
                            <Link to={createPageUrl('Donate')}>
                                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                                    Make Your First Donation
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {filteredDonations.map((donation) => (
                            <DonationReceiptCard key={donation.id} donation={donation} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}