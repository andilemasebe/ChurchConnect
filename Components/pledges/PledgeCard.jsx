import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, TrendingUp, Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fundConfig } from "../donations/FundCard";
import { cn } from "@/lib/utils";

export default function PledgeCard({ pledge, onEdit, onDelete, isAdmin }) {
    const fundInfo = fundConfig[pledge.fund];
    const Icon = fundInfo.icon;

    const statusConfig = {
        active: { icon: Clock, label: "Active", color: "bg-blue-100 text-blue-700" },
        completed: { icon: CheckCircle, label: "Completed", color: "bg-green-100 text-green-700" },
        cancelled: { icon: XCircle, label: "Cancelled", color: "bg-red-100 text-red-700" }
    };

    const statusInfo = statusConfig[pledge.status];
    const StatusIcon = statusInfo.icon;

    const progressPercentage = pledge.total_pledged > 0 
        ? Math.min((pledge.amount_fulfilled / pledge.total_pledged) * 100, 100)
        : 0;

    const remaining = Math.max(pledge.total_pledged - pledge.amount_fulfilled, 0);
    const daysRemaining = differenceInDays(new Date(pledge.end_date), new Date());

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                            fundInfo.color
                        )}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">{pledge.pledger_name}</h3>
                            <p className="text-sm text-slate-500">{fundInfo.label}</p>
                        </div>
                    </div>
                    <Badge className={cn("text-xs flex items-center gap-1", statusInfo.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Amount Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-medium mb-1">Per Period</p>
                        <p className="text-2xl font-bold text-purple-700">
                            ${pledge.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-purple-600 capitalize mt-1">{pledge.frequency}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600 font-medium mb-1">Total Pledged</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ${pledge.total_pledged.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            ${pledge.amount_fulfilled.toFixed(2)} fulfilled
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold text-slate-900">
                            {progressPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-slate-500">
                        ${remaining.toFixed(2)} remaining
                    </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-500">Start</p>
                            <p className="text-slate-700 font-medium">
                                {format(new Date(pledge.start_date), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-500">End</p>
                            <p className="text-slate-700 font-medium">
                                {format(new Date(pledge.end_date), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Days Remaining */}
                {pledge.status === 'active' && daysRemaining > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>{daysRemaining}</strong> days remaining in pledge period
                        </p>
                    </div>
                )}

                {pledge.status === 'active' && daysRemaining <= 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            Pledge period has ended
                        </p>
                    </div>
                )}

                {/* Notes */}
                {pledge.notes && (
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm text-slate-600 italic">"{pledge.notes}"</p>
                    </div>
                )}

                {/* Admin Actions */}
                {(isAdmin || pledge.pledger_email === pledge.created_by) && (
                    <div className="flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(pledge)}
                            className="flex-1"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(pledge)}
                            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}