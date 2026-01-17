import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TrendChart({ data, title, description, type = "line" }) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500 text-center py-8">No data available</p>
                </CardContent>
            </Card>
        );
    }

    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const avg = total / data.length;
    const trend = data.length >= 2 
        ? ((data[data.length - 1].amount - data[0].amount) / data[0].amount) * 100 
        : 0;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm text-slate-600">{payload[0].payload.name}</p>
                    <p className="text-lg font-bold text-purple-600">
                        ${payload[0].value.toLocaleString()}
                    </p>
                    {payload[0].payload.count && (
                        <p className="text-xs text-slate-500">
                            {payload[0].payload.count} donations
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                            ${total.toLocaleString()}
                        </p>
                        <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span>{Math.abs(trend).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {type === "line" ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#6b7280"
                                fontSize={12}
                            />
                            <YAxis 
                                stroke="#6b7280"
                                fontSize={12}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#9333ea" 
                                strokeWidth={3}
                                dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#6b7280"
                                fontSize={12}
                            />
                            <YAxis 
                                stroke="#6b7280"
                                fontSize={12}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="amount" 
                                fill="url(#colorGradient)"
                                radius={[8, 8, 0, 0]}
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333ea" stopOpacity={0.8}/>
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    )}
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-slate-600">
                    Average: <span className="font-semibold text-slate-900">${avg.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}