import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import DonationForm from "../Components/donations/DonationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";
import { fundConfig } from "../Components/donations/FundCard";

export default function DonatePage() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastDonation, setLastDonation] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    React.useEffect(() => {
        base44.auth.me().then(user => setCurrentUser(user)).catch(() => {});
    }, []);

    const createDonationMutation = useMutation({
        mutationFn: async (donationData) => {
            // Create the donation
            const donation = await base44.entities.Donation.create(donationData);
            
            // Send receipt email
            await sendReceiptEmail(donation);
            
            return donation;
        },
        onSuccess: (donation) => {
            queryClient.invalidateQueries({ queryKey: ['donations'] });
            setLastDonation(donation);
            setShowSuccess(true);
        },
    });

    const sendReceiptEmail = async (donation) => {
        const fundInfo = fundConfig[donation.fund];
        const donationDate = format(new Date(donation.created_date), 'MMMM dd, yyyy');
        const donationTime = format(new Date(donation.created_date), 'h:mm a');
        
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt-box { background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .receipt-row:last-child { border-bottom: none; }
        .label { color: #6b7280; font-weight: 500; }
        .value { color: #111827; font-weight: 600; }
        .amount { font-size: 32px; color: #9333ea; font-weight: bold; text-align: center; margin: 20px 0; }
        .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🙏 Thank You for Your Generosity!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your donation has been received</p>
        </div>
        
        <div class="content">
            <p>Dear ${donation.donor_name},</p>
            
            <p>Thank you for your generous donation to ${fundInfo.label}. Your support helps us continue our mission and make a lasting impact in our community.</p>
            
            <div class="amount">$${donation.amount.toFixed(2)}</div>
            
            <div class="receipt-box">
                <h2 style="margin-top: 0; color: #111827;">Donation Receipt</h2>
                
                <div class="receipt-row">
                    <span class="label">Transaction ID:</span>
                    <span class="value">${donation.transaction_id}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">Date:</span>
                    <span class="value">${donationDate} at ${donationTime}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">Fund:</span>
                    <span class="value">${fundInfo.label}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">Amount:</span>
                    <span class="value">$${donation.amount.toFixed(2)}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">Donation Type:</span>
                    <span class="value">${donation.donation_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">Payment Method:</span>
                    <span class="value">${donation.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                
                ${donation.donation_type !== 'one_time' && donation.next_charge_date ? `
                <div class="receipt-row">
                    <span class="label">Next Charge Date:</span>
                    <span class="value">${format(new Date(donation.next_charge_date), 'MMMM dd, yyyy')}</span>
                </div>
                ` : ''}
            </div>
            
            ${donation.notes ? `
            <div class="message-box">
                <strong>Your Message:</strong><br/>
                "${donation.notes}"
            </div>
            ` : ''}
            
            <p style="margin-top: 30px;"><strong>Tax Information:</strong><br/>
            This receipt serves as proof of your charitable contribution. Please keep this for your tax records. Our organization is a registered 501(c)(3) nonprofit organization.</p>
            
            ${donation.is_anonymous ? '<p style="color: #6b7280; font-style: italic;">This donation has been marked as anonymous and will not be publicly displayed.</p>' : ''}
            
            <div class="footer">
                <p><strong>Church Connect</strong></p>
                <p>This is an automated receipt. Please do not reply to this email.</p>
                <p>If you have any questions about your donation, please contact us.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `.trim();

        try {
            await base44.integrations.Core.SendEmail({
                from_name: "Church Connect - Donations",
                to: donation.donor_email,
                subject: `Donation Receipt - $${donation.amount.toFixed(2)} to ${fundInfo.label}`,
                body: emailBody
            });
        } catch (error) {
            console.error("Failed to send receipt email:", error);
            // Don't throw - we still want the donation to succeed even if email fails
        }
    };

    const handleSubmit = async (donationData) => {
        await createDonationMutation.mutateAsync(donationData);
    };

    if (showSuccess && lastDonation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 flex items-center justify-center">
                <Card className="max-w-2xl w-full animate-in fade-in zoom-in duration-500">
                    <CardContent className="p-12 text-center">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">
                            Thank You for Your Generosity!
                        </h1>
                        
                        <p className="text-lg text-slate-600 mb-8">
                            Your donation of <strong className="text-purple-600">${lastDonation.amount.toFixed(2)}</strong> has been received and will make a real difference.
                        </p>

                        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                            <p className="text-sm text-slate-600 mb-2">Transaction ID</p>
                            <p className="font-mono text-sm text-slate-900 mb-4">{lastDonation.transaction_id}</p>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    ✅ A detailed receipt has been emailed to <strong>{lastDonation.donor_email}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                onClick={() => navigate(createPageUrl('DonationHistory'))}
                                variant="outline"
                                className="flex-1 h-14"
                            >
                                View History
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowSuccess(false);
                                    setLastDonation(null);
                                }}
                                className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                            >
                                Make Another Gift
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-6 shadow-xl shadow-purple-200">
                        <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                        Give With Purpose
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Your generosity empowers our mission and transforms lives in our community
                    </p>
                </div>

                {/* Donation Form */}
                <DonationForm onSubmit={handleSubmit} currentUser={currentUser} />

                {/* Security Badge */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        🔒 Secure & encrypted • All donations are tax-deductible
                    </p>
                </div>
            </div>
        </div>
    );
}