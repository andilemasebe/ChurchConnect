import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Sparkles, 
    TrendingUp, 
    Users, 
    Download, 
    RefreshCw,
    Loader2,
    BarChart3,
    Brain,
    Target,
    Calendar
} from "lucide-react";
import AIInsightsCard from "../Components/donations/AIInsightsCard";
import DonorSegmentCard from "../Components/donations/DonorSegmentCard";
import TrendChart from "../Components/donations/TrendChart";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export default function DonationAnalyticsPage() {
    const [insights, setInsights] = useState(null);
    const [segments, setSegments] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data: donations, isLoading: donationsLoading } = useQuery({
        queryKey: ['donations-analytics'],
        queryFn: () => base44.entities.Donation.list('-created_date', 1000),
        initialData: [],
    });

    // Prepare historical data for charts
    const getMonthlyData = () => {
        const monthlyMap = {};
        donations.forEach(d => {
            const month = format(new Date(d.created_date), 'MMM yyyy');
            if (!monthlyMap[month]) {
                monthlyMap[month] = { name: month, amount: 0, count: 0 };
            }
            monthlyMap[month].amount += d.amount;
            monthlyMap[month].count += 1;
        });
        return Object.values(monthlyMap).slice(-12);
    };

    const getFundData = () => {
        const fundMap = {};
        donations.forEach(d => {
            if (!fundMap[d.fund]) {
                fundMap[d.fund] = { name: d.fund, amount: 0, count: 0 };
            }
            fundMap[d.fund].amount += d.amount;
            fundMap[d.fund].count += 1;
        });
        return Object.values(fundMap).map(f => ({
            ...f,
            name: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace('_', ' ')
        }));
    };

    const generateAIInsights = async () => {
        setLoading(true);
        try {
            // Prepare donation summary for AI
            const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
            const avgDonation = totalAmount / donations.length;
            const recurringCount = donations.filter(d => d.donation_type !== 'one_time').length;
            const donorEmails = [...new Set(donations.map(d => d.donor_email))];
            
            const last3Months = donations.filter(d => 
                new Date(d.created_date) >= subMonths(new Date(), 3)
            );
            const prev3Months = donations.filter(d => {
                const date = new Date(d.created_date);
                return date < subMonths(new Date(), 3) && date >= subMonths(new Date(), 6);
            });

            const recentTotal = last3Months.reduce((sum, d) => sum + d.amount, 0);
            const previousTotal = prev3Months.reduce((sum, d) => sum + d.amount, 0);
            const growthRate = previousTotal > 0 
                ? ((recentTotal - previousTotal) / previousTotal * 100).toFixed(1) 
                : 0;

            const fundBreakdown = getFundData();

            const prompt = `Analyze this church donation data and provide strategic insights:

DONATION SUMMARY:
- Total donations: ${donations.length}
- Total amount: $${totalAmount.toFixed(2)}
- Average donation: $${avgDonation.toFixed(2)}
- Unique donors: ${donorEmails.length}
- Recurring donors: ${recurringCount}
- Growth rate (last 3 months vs previous): ${growthRate}%

FUND BREAKDOWN:
${fundBreakdown.map(f => `- ${f.name}: $${f.amount.toFixed(2)} (${f.count} donations)`).join('\n')}

RECENT TRENDS:
- Last 3 months: $${recentTotal.toFixed(2)} (${last3Months.length} donations)
- Previous 3 months: $${previousTotal.toFixed(2)} (${prev3Months.length} donations)

Provide 5-7 actionable insights covering:
1. Donation trends and patterns
2. Opportunities for growth
3. Potential concerns or risks
4. Fund-specific observations
5. Donor engagement strategies

For each insight, categorize the type (trend/opportunity/alert/success) and priority (high/medium/low).`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        insights: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: { 
                                        type: "string",
                                        enum: ["trend", "opportunity", "alert", "success"]
                                    },
                                    priority: {
                                        type: "string",
                                        enum: ["high", "medium", "low"]
                                    },
                                    action: { type: "string" },
                                    metric: { type: "string" }
                                },
                                required: ["title", "description", "type", "priority"]
                            }
                        }
                    },
                    required: ["insights"]
                }
            });

            setInsights(result.insights);
        } catch (error) {
            console.error("Failed to generate AI insights:", error);
        }
        setLoading(false);
    };

    const generateDonorSegments = async () => {
        setLoading(true);
        try {
            // Group donations by donor
            const donorMap = {};
            donations.forEach(d => {
                if (!donorMap[d.donor_email]) {
                    donorMap[d.donor_email] = {
                        email: d.donor_email,
                        name: d.donor_name,
                        donations: [],
                        total: 0
                    };
                }
                donorMap[d.donor_email].donations.push(d);
                donorMap[d.donor_email].total += d.amount;
            });

            const donors = Object.values(donorMap);
            
            const prompt = `Analyze these donor profiles and create meaningful segments:

DONOR STATISTICS:
- Total donors: ${donors.length}
- Donation amounts range: $${Math.min(...donors.map(d => d.total)).toFixed(2)} - $${Math.max(...donors.map(d => d.total)).toFixed(2)}
- Average per donor: $${(donors.reduce((sum, d) => sum + d.total, 0) / donors.length).toFixed(2)}

SAMPLE PROFILES:
${donors.slice(0, 10).map(d => 
    `- ${d.name}: ${d.donations.length} donations, $${d.total.toFixed(2)} total, types: ${[...new Set(d.donations.map(don => don.donation_type))].join(', ')}`
).join('\n')}

Create 4-6 donor segments with:
1. Segment name and description
2. Estimated count in each segment
3. Key characteristics
4. Average donation amount
5. Total amount for segment
6. Personalized outreach strategy for each segment

Consider factors like: giving frequency, amount, recency, donation type, fund preferences.`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        segments: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    count: { type: "number" },
                                    avg_donation: { type: "number" },
                                    total_amount: { type: "number" },
                                    characteristics: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    outreach_strategy: { type: "string" }
                                },
                                required: ["id", "name", "description", "count", "outreach_strategy"]
                            }
                        }
                    },
                    required: ["segments"]
                }
            });

            setSegments(result.segments);
        } catch (error) {
            console.error("Failed to generate donor segments:", error);
        }
        setLoading(false);
    };

    const generatePredictions = async () => {
        setLoading(true);
        try {
            const monthlyData = getMonthlyData();
            
            const prompt = `Based on this donation history, predict the next 3 months:

HISTORICAL DATA (last 12 months):
${monthlyData.map(m => `${m.name}: $${m.amount.toFixed(2)} (${m.count} donations)`).join('\n')}

CURRENT METRICS:
- Average monthly: $${(monthlyData.reduce((sum, m) => sum + m.amount, 0) / monthlyData.length).toFixed(2)}
- Trend: ${monthlyData.length >= 2 ? ((monthlyData[monthlyData.length - 1].amount - monthlyData[0].amount) / monthlyData[0].amount * 100).toFixed(1) : 0}%

Provide:
1. Predictions for next 3 months (amount and donation count)
2. Confidence level for each prediction
3. Key factors influencing predictions
4. Recommendations to achieve or exceed predictions
5. Potential risks or opportunities`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        predictions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    month: { type: "string" },
                                    predicted_amount: { type: "number" },
                                    predicted_count: { type: "number" },
                                    confidence: { type: "string" }
                                },
                                required: ["month", "predicted_amount", "predicted_count", "confidence"]
                            }
                        },
                        key_factors: {
                            type: "array",
                            items: { type: "string" }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        },
                        risks_opportunities: { type: "string" }
                    },
                    required: ["predictions", "key_factors", "recommendations"]
                }
            });

            setPredictions(result);
        } catch (error) {
            console.error("Failed to generate predictions:", error);
        }
        setLoading(false);
    };

    const generateMonthlyReport = async () => {
        setLoading(true);
        try {
            const thisMonth = startOfMonth(new Date());
            const lastMonth = startOfMonth(subMonths(new Date(), 1));
            
            const thisMonthDonations = donations.filter(d => 
                new Date(d.created_date) >= thisMonth
            );
            const lastMonthDonations = donations.filter(d => {
                const date = new Date(d.created_date);
                return date >= lastMonth && date < thisMonth;
            });

            const thisMonthTotal = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);
            const lastMonthTotal = lastMonthDonations.reduce((sum, d) => sum + d.amount, 0);

            const prompt = `Generate a comprehensive monthly giving report:

THIS MONTH (${format(thisMonth, 'MMMM yyyy')}):
- Total: $${thisMonthTotal.toFixed(2)}
- Donations: ${thisMonthDonations.length}
- Unique donors: ${[...new Set(thisMonthDonations.map(d => d.donor_email))].length}
- Average: $${(thisMonthTotal / thisMonthDonations.length || 0).toFixed(2)}

LAST MONTH (${format(lastMonth, 'MMMM yyyy')}):
- Total: $${lastMonthTotal.toFixed(2)}
- Donations: ${lastMonthDonations.length}
- Unique donors: ${[...new Set(lastMonthDonations.map(d => d.donor_email))].length}

FUND BREAKDOWN THIS MONTH:
${getFundData().map(f => `- ${f.name}: $${thisMonthDonations.filter(d => d.fund === f.name.toLowerCase().replace(' ', '_')).reduce((sum, d) => sum + d.amount, 0).toFixed(2)}`).join('\n')}

Create a report with:
1. Executive summary (2-3 sentences)
2. Key highlights (3-5 points)
3. Growth areas with specific metrics
4. Areas needing attention
5. 3-5 strategic recommendations for next month
6. Outreach strategies to improve engagement`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        highlights: {
                            type: "array",
                            items: { type: "string" }
                        },
                        growth_areas: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    area: { type: "string" },
                                    metric: { type: "string" },
                                    description: { type: "string" }
                                },
                                required: ["area", "metric", "description"]
                            }
                        },
                        concerns: {
                            type: "array",
                            items: { type: "string" }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        },
                        outreach_strategies: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["summary", "highlights", "growth_areas", "recommendations", "outreach_strategies"]
                }
            });

            setMonthlyReport(result);
        } catch (error) {
            console.error("Failed to generate monthly report:", error);
        }
        setLoading(false);
    };

    const downloadReport = () => {
        const reportContent = `
MONTHLY GIVING REPORT
Generated: ${format(new Date(), 'PPP')}

=================================
EXECUTIVE SUMMARY
=================================
${monthlyReport.summary}

=================================
KEY HIGHLIGHTS
=================================
${monthlyReport.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

=================================
GROWTH AREAS
=================================
${monthlyReport.growth_areas.map(g => `
${g.area}
Metric: ${g.metric}
${g.description}
`).join('\n')}

=================================
CONCERNS
=================================
${monthlyReport.concerns?.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'None identified'}

=================================
RECOMMENDATIONS
=================================
${monthlyReport.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

=================================
OUTREACH STRATEGIES
=================================
${monthlyReport.outreach_strategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
Report generated by Church Connect AI Analytics
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `giving-report-${format(new Date(), 'yyyy-MM')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (donationsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                AI-Powered Donation Analytics
                            </h1>
                            <p className="text-slate-600">
                                Advanced insights and predictions for strategic giving management
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={generateAIInsights}
                            disabled={loading || donations.length === 0}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                        >
                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Generate AI Insights
                        </Button>
                        <Button
                            onClick={generateDonorSegments}
                            disabled={loading || donations.length === 0}
                            variant="outline"
                        >
                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}
                            Analyze Donor Segments
                        </Button>
                        <Button
                            onClick={generatePredictions}
                            disabled={loading || donations.length === 0}
                            variant="outline"
                        >
                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                            Predict Trends
                        </Button>
                        <Button
                            onClick={generateMonthlyReport}
                            disabled={loading || donations.length === 0}
                            variant="outline"
                        >
                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BarChart3 className="h-4 w-4 mr-2" />}
                            Monthly Report
                        </Button>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <TrendChart
                        data={getMonthlyData()}
                        title="Monthly Donation Trends"
                        description="Last 12 months performance"
                        type="line"
                    />
                    <TrendChart
                        data={getFundData()}
                        title="Donations by Fund"
                        description="Fund allocation breakdown"
                        type="bar"
                    />
                </div>

                {/* AI Results */}
                <Tabs defaultValue="insights" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                        <TabsTrigger value="insights" className="gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="hidden sm:inline">Insights</span>
                        </TabsTrigger>
                        <TabsTrigger value="segments" className="gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Segments</span>
                        </TabsTrigger>
                        <TabsTrigger value="predictions" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Predictions</span>
                        </TabsTrigger>
                        <TabsTrigger value="report" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Report</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="insights" className="space-y-4">
                        {insights ? (
                            insights.map((insight, index) => (
                                <AIInsightsCard key={index} insight={insight} index={index} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        AI Insights Not Generated Yet
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Click "Generate AI Insights" to analyze your donation data and receive strategic recommendations
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="segments" className="space-y-4">
                        {segments ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {segments.map((segment, index) => (
                                    <DonorSegmentCard key={segment.id} segment={segment} index={index} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Target className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        Donor Segments Not Analyzed Yet
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Click "Analyze Donor Segments" to identify key donor groups and personalized outreach strategies
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="predictions">
                        {predictions ? (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-purple-600" />
                                            3-Month Donation Forecast
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {predictions.predictions.map((pred, index) => (
                                                <Card key={index} className="border-2 border-purple-200">
                                                    <CardContent className="pt-6">
                                                        <p className="text-sm text-slate-600 mb-1">{pred.month}</p>
                                                        <p className="text-3xl font-bold text-purple-600 mb-2">
                                                            ${pred.predicted_amount.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-slate-600 mb-2">
                                                            ~{pred.predicted_count} donations
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Confidence: {pred.confidence}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 mb-2">Key Factors:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-slate-600">
                                                    {predictions.key_factors.map((factor, i) => (
                                                        <li key={i}>{factor}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-900 mb-2">Recommendations:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-slate-600">
                                                    {predictions.recommendations.map((rec, i) => (
                                                        <li key={i}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {predictions.risks_opportunities && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <h4 className="font-semibold text-amber-900 mb-2">
                                                        Risks & Opportunities:
                                                    </h4>
                                                    <p className="text-sm text-amber-800">
                                                        {predictions.risks_opportunities}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Calendar className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        Predictions Not Generated Yet
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Click "Predict Trends" to forecast donation patterns for the next 3 months
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="report">
                        {monthlyReport ? (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <Button onClick={downloadReport} variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report
                                    </Button>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Executive Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-700 leading-relaxed">
                                            {monthlyReport.summary}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Key Highlights</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {monthlyReport.highlights.map((highlight, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                        ✓
                                                    </span>
                                                    <span className="text-slate-700 leading-relaxed">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Growth Areas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {monthlyReport.growth_areas.map((area, i) => (
                                                <div key={i} className="border-l-4 border-l-green-500 pl-4 py-2">
                                                    <h4 className="font-semibold text-slate-900 mb-1">{area.area}</h4>
                                                    <p className="text-sm text-green-600 font-medium mb-2">{area.metric}</p>
                                                    <p className="text-slate-600">{area.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {monthlyReport.concerns && monthlyReport.concerns.length > 0 && (
                                    <Card className="border-amber-200">
                                        <CardHeader>
                                            <CardTitle className="text-amber-900">Areas Needing Attention</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {monthlyReport.concerns.map((concern, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <span className="text-amber-600">⚠️</span>
                                                        <span className="text-slate-700">{concern}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card className="border-purple-200">
                                    <CardHeader>
                                        <CardTitle className="text-purple-900">Strategic Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="space-y-3">
                                            {monthlyReport.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-slate-700 leading-relaxed">{rec}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>

                                <Card className="border-indigo-200">
                                    <CardHeader>
                                        <CardTitle className="text-indigo-900">Outreach Strategies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {monthlyReport.outreach_strategies.map((strategy, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="text-indigo-600">💡</span>
                                                    <span className="text-slate-700 leading-relaxed">{strategy}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <BarChart3 className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        Monthly Report Not Generated Yet
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Click "Monthly Report" to generate a comprehensive analysis with strategic recommendations
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}