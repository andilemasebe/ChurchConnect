import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function DonorSegmentCard({ segment, index }) {
    const segmentColors = {
        high_value: "from-purple-500 to-indigo-600",
        regular: "from-blue-500 to-cyan-600",
        occasional: "from-amber-500 to-orange-600",
        at_risk: "from-red-500 to-rose-600",
        new: "from-green-500 to-emerald-600"
    };

    const gradient = segmentColors[segment.id] || segmentColors.regular;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="hover:shadow-xl transition-all duration-300 border-slate-200">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{segment.name}</CardTitle>
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <Users className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">{segment.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                                <Users className="h-3 w-3" />
                                <span>Donors</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{segment.count}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                                <DollarSign className="h-3 w-3" />
                                <span>Total</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                R{segment.total_amount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>

                    {segment.avg_donation && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Avg. Donation:</span>
                            <span className="font-semibold text-slate-900">
                                R{segment.avg_donation.toFixed(2)}
                            </span>
                        </div>
                    )}

                    {segment.characteristics && segment.characteristics.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Key Characteristics:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {segment.characteristics.map((char, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {char}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {segment.outreach_strategy && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-purple-900 text-sm font-medium mb-2">
                                <Mail className="h-4 w-4" />
                                <span>Outreach Strategy:</span>
                            </div>
                            <p className="text-sm text-purple-700 leading-relaxed">
                                {segment.outreach_strategy}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}