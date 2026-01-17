import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AIInsightsCard({ insight, index }) {
    const priorityColors = {
        high: "bg-red-100 text-red-700 border-red-200",
        medium: "bg-amber-100 text-amber-700 border-amber-200",
        low: "bg-blue-100 text-blue-700 border-blue-200"
    };

    const typeIcons = {
        trend: TrendingUp,
        opportunity: Sparkles,
        alert: AlertCircle,
        success: CheckCircle
    };

    const Icon = typeIcons[insight.type] || Sparkles;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{insight.title}</CardTitle>
                                <CardDescription className="text-xs mt-1">
                                    AI-Generated Insight
                                </CardDescription>
                            </div>
                        </div>
                        {insight.priority && (
                            <Badge className={priorityColors[insight.priority]}>
                                {insight.priority} priority
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        {insight.description}
                    </p>
                    {insight.action && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-purple-900 mb-1">
                                💡 Recommended Action:
                            </p>
                            <p className="text-sm text-purple-700">
                                {insight.action}
                            </p>
                        </div>
                    )}
                    {insight.metric && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-slate-600">Impact Metric:</span>
                            <span className="font-semibold text-slate-900">{insight.metric}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}