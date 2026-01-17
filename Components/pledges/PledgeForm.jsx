import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FundCard from "../donations/FundCard";

export default function PledgeForm({ pledge, onSave, onCancel, isLoading }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        pledger_name: "",
        pledger_email: "",
        amount: "",
        frequency: "monthly",
        fund: "general",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        notes: ""
    });

    useEffect(() => {
        base44.auth.me().then(user => {
            setCurrentUser(user);
            if (!pledge) {
                setFormData(prev => ({
                    ...prev,
                    pledger_name: user.full_name || "",
                    pledger_email: user.email || ""
                }));
            }
        }).catch(() => {});
    }, [pledge]);

    useEffect(() => {
        if (pledge) {
            setFormData(pledge);
        }
    }, [pledge]);

    const calculateTotalPledged = () => {
        const amount = parseFloat(formData.amount) || 0;
        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        
        if (!formData.start_date || !formData.end_date || amount === 0) return 0;
        
        const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        
        switch (formData.frequency) {
            case "monthly":
                return amount * Math.max(monthsDiff, 1);
            case "quarterly":
                return amount * Math.max(Math.floor(monthsDiff / 3), 1);
            case "annual":
                return amount * Math.max(Math.floor(monthsDiff / 12), 1);
            case "one_time":
                return amount;
            default:
                return 0;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const total_pledged = calculateTotalPledged();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
            total_pledged,
            amount_fulfilled: pledge?.amount_fulfilled || 0,
            status: pledge?.status || "active"
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {pledge ? "Edit Pledge" : "Make a Giving Pledge"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Your Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pledger_name">Full Name *</Label>
                                <Input
                                    id="pledger_name"
                                    value={formData.pledger_name}
                                    onChange={(e) => handleChange("pledger_name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pledger_email">Email Address *</Label>
                                <Input
                                    id="pledger_email"
                                    type="email"
                                    value={formData.pledger_email}
                                    onChange={(e) => handleChange("pledger_email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fund Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Select Fund
                        </h3>
                        <div className="grid gap-3">
                            {["general", "building", "missions", "youth", "worship"].map((fund) => (
                                <FundCard
                                    key={fund}
                                    fund={fund}
                                    selected={formData.fund === fund}
                                    onClick={() => handleChange("fund", fund)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pledge Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Pledge Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount per Period *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => handleChange("amount", e.target.value)}
                                        className="pl-8"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency *</Label>
                                <Select
                                    value={formData.frequency}
                                    onValueChange={(value) => handleChange("frequency", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="annual">Annual</SelectItem>
                                        <SelectItem value="one_time">One Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date *</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange("start_date", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => handleChange("end_date", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Calculated Total */}
                        {formData.amount && formData.start_date && formData.end_date && (
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-700 font-medium">Total Pledge Amount</p>
                                        <p className="text-xs text-purple-600 mt-1">
                                            Based on ${formData.amount} {formData.frequency}
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-600">
                                        ${calculateTotalPledged().toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder="Add any additional notes about your pledge..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {pledge ? "Update Pledge" : "Create Pledge"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}