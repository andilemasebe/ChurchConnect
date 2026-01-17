import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Calendar, DollarSign, Heart, Loader2 } from "lucide-react";
import FundCard from "./FundCard";
import { cn } from "@/lib/utils";

export default function DonationForm({ onSubmit, currentUser }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fund: "general",
        amount: "",
        donation_type: "one_time",
        donor_name: currentUser?.full_name || "",
        donor_email: currentUser?.email || "",
        payment_method: "card",
        notes: "",
        is_anonymous: false,
        card_number: "",
        card_expiry: "",
        card_cvc: ""
    });

    const handleNext = () => {
        if (step === 1 && !formData.fund) return;
        if (step === 2 && (!formData.amount || formData.amount < 1)) return;
        setStep(step + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const donationData = {
            amount: parseFloat(formData.amount),
            fund: formData.fund,
            donation_type: formData.donation_type,
            donor_name: formData.donor_name,
            donor_email: formData.donor_email,
            payment_method: formData.payment_method,
            notes: formData.notes,
            is_anonymous: formData.is_anonymous,
            status: "completed",
            transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        // Calculate next charge date for recurring donations
        if (formData.donation_type !== "one_time") {
            const nextDate = new Date();
            if (formData.donation_type === "monthly") {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (formData.donation_type === "quarterly") {
                nextDate.setMonth(nextDate.getMonth() + 3);
            } else if (formData.donation_type === "annual") {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            donationData.next_charge_date = nextDate.toISOString().split('T')[0];
        }

        await onSubmit(donationData);
        setLoading(false);
    };

    const quickAmounts = [25, 50, 100, 250, 500];

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                step >= s 
                                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" 
                                    : "bg-slate-200 text-slate-500"
                            )}>
                                {s}
                            </div>
                            {s < 4 && (
                                <div className={cn(
                                    "h-1 flex-1 mx-2 rounded transition-all",
                                    step > s ? "bg-gradient-to-r from-purple-500 to-indigo-600" : "bg-slate-200"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-2 px-2">
                    <span>Fund</span>
                    <span>Amount</span>
                    <span>Details</span>
                    <span>Payment</span>
                </div>
            </div>

            {/* Step 1: Select Fund */}
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Impact</h2>
                        <p className="text-slate-600">Select the fund you'd like to support</p>
                    </div>

                    <div className="grid gap-4">
                        {["general", "building", "missions", "youth", "worship"].map((fund) => (
                            <FundCard
                                key={fund}
                                fund={fund}
                                selected={formData.fund === fund}
                                onClick={() => setFormData({ ...formData, fund })}
                            />
                        ))}
                    </div>

                    <Button 
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-6 text-lg"
                        disabled={!formData.fund}
                    >
                        Continue
                    </Button>
                </div>
            )}

            {/* Step 2: Amount & Frequency */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <DollarSign className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Set Your Giving</h2>
                        <p className="text-slate-600">Choose amount and frequency</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Donation Amount</CardTitle>
                            <CardDescription>Every gift makes a difference</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Quick amounts */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {quickAmounts.map((amount) => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant={formData.amount === amount.toString() ? "default" : "outline"}
                                        onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                                        className={cn(
                                            "h-16",
                                            formData.amount === amount.toString() && 
                                            "bg-gradient-to-br from-purple-500 to-indigo-600"
                                        )}
                                    >
                                        R{amount}
                                    </Button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div>
                                <Label htmlFor="amount">Or enter custom amount</Label>
                                <div className="relative mt-2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">R</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="pl-8 h-14 text-lg"
                                    />
                                </div>
                            </div>

                            {/* Frequency */}
                            <div>
                                <Label>Donation Frequency</Label>
                                <RadioGroup
                                    value={formData.donation_type}
                                    onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
                                    className="grid grid-cols-2 gap-3 mt-2"
                                >
                                    {[
                                        { value: "one_time", label: "One Time", icon: Heart },
                                        { value: "monthly", label: "Monthly", icon: Calendar },
                                        { value: "quarterly", label: "Quarterly", icon: Calendar },
                                        { value: "annual", label: "Annual", icon: Calendar }
                                    ].map(({ value, label, icon: Icon }) => (
                                        <Label
                                            key={value}
                                            htmlFor={value}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                formData.donation_type === value
                                                    ? "border-purple-500 bg-purple-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <RadioGroupItem value={value} id={value} />
                                            <Icon className="h-4 w-4" />
                                            <span className="font-medium">{label}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1 py-6"
                        >
                            Back
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleNext}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-6"
                            disabled={!formData.amount || formData.amount < 1}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Details</h2>
                        <p className="text-slate-600">We'll send your receipt here</p>
                    </div>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <Label htmlFor="donor_name">Full Name *</Label>
                                <Input
                                    id="donor_name"
                                    value={formData.donor_name}
                                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                                    className="mt-2 h-12"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="donor_email">Email Address *</Label>
                                <Input
                                    id="donor_email"
                                    type="email"
                                    value={formData.donor_email}
                                    onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                                    className="mt-2 h-12"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Message (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Add a personal message or prayer request..."
                                    className="mt-2 min-h-[100px]"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <Label htmlFor="anonymous" className="cursor-pointer">Make this gift anonymous</Label>
                                    <p className="text-sm text-slate-600 mt-1">Your name won't be publicly displayed</p>
                                </div>
                                <Switch
                                    id="anonymous"
                                    checked={formData.is_anonymous}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1 py-6"
                        >
                            Back
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleNext}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-6"
                            disabled={!formData.donor_name || !formData.donor_email}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <CreditCard className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure Payment</h2>
                        <p className="text-slate-600">Your information is safe and encrypted</p>
                    </div>

                    <Card className="border-2 border-purple-200 bg-purple-50/30">
                        <CardContent className="pt-6">
                            <div className="bg-white rounded-lg p-6 space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-slate-600">Fund:</span>
                                    <span className="font-semibold capitalize">{formData.fund.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-slate-600">Frequency:</span>
                                    <span className="font-semibold capitalize">{formData.donation_type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-purple-600">R{formData.amount}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <Label htmlFor="card_number">Card Number (Demo)</Label>
                                <Input
                                    id="card_number"
                                    placeholder="4242 4242 4242 4242"
                                    value={formData.card_number}
                                    onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                                    className="mt-2 h-12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="card_expiry">Expiry (Demo)</Label>
                                    <Input
                                        id="card_expiry"
                                        placeholder="MM/YY"
                                        value={formData.card_expiry}
                                        onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                                        className="mt-2 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="card_cvc">CVC (Demo)</Label>
                                    <Input
                                        id="card_cvc"
                                        placeholder="123"
                                        value={formData.card_cvc}
                                        onChange={(e) => setFormData({ ...formData, card_cvc: e.target.value })}
                                        className="mt-2 h-12"
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed. 
                                    To enable real payments, enable backend functions in your dashboard.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setStep(3)}
                            className="flex-1 py-6"
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button 
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Complete Donation</>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}