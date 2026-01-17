import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fundConfig } from "./FundCard";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

export default function DonationReceiptCard({ donation }) {
    const fundInfo = fundConfig[donation.fund];
    const Icon = fundInfo.icon;

    const statusConfig = {
        completed: { icon: CheckCircle, label: "Completed", color: "text-green-600 bg-green-50" },
        pending: { icon: Clock, label: "Pending", color: "text-amber-600 bg-amber-50" },
        failed: { icon: XCircle, label: "Failed", color: "text-red-600 bg-red-50" }
    };

    const statusInfo = statusConfig[donation.status];
    const StatusIcon = statusInfo.icon;

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Colors
        const primaryColor = [147, 51, 234]; // Purple
        const secondaryColor = [79, 70, 229]; // Indigo
        const textDark = [17, 24, 39];
        const textLight = [107, 114, 128];
        
        // Header with gradient background (simulated)
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        // Church Logo/Icon (simple representation)
        doc.setFillColor(255, 255, 255);
        doc.circle(pageWidth / 2, 20, 8, 'F');
        doc.setFontSize(16);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('⛪', pageWidth / 2 - 3, 23);
        
        // Church Name
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('Church Connect', pageWidth / 2, 35, { align: 'center' });
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('Donation Receipt', pageWidth / 2, 60, { align: 'center' });
        
        // Transaction Box
        doc.setDrawColor(229, 231, 235);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, 70, pageWidth - 30, 25, 3, 3, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text('Transaction ID', 20, 78);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(donation.transaction_id, 20, 85);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text('Date', 20, 92);
        doc.setFontSize(11);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(format(new Date(donation.created_date), 'MMMM dd, yyyy'), 20, 99);
        
        // Amount (prominent)
        doc.setFontSize(36);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`R${donation.amount.toFixed(2)}`, pageWidth / 2, 125, { align: 'center' });
        
        // Donor Information
        let y = 145;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('Donor Information', 20, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text('Name:', 20, y);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(donation.donor_name, 50, y);
        y += 7;
        
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text('Email:', 20, y);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(donation.donor_email, 50, y);
        y += 15;
        
        // Donation Details
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('Donation Details', 20, y);
        y += 10;
        
        const details = [
            ['Fund:', fundInfo.label],
            ['Type:', donation.donation_type.replace('_', ' ').charAt(0).toUpperCase() + donation.donation_type.replace('_', ' ').slice(1)],
            ['Payment Method:', donation.payment_method.charAt(0).toUpperCase() + donation.payment_method.slice(1)],
            ['Status:', donation.status.charAt(0).toUpperCase() + donation.status.slice(1)]
        ];
        
        if (donation.donation_type !== 'one_time' && donation.next_charge_date) {
            details.push(['Next Charge:', format(new Date(donation.next_charge_date), 'MMMM dd, yyyy')]);
        }
        
        doc.setFontSize(10);
        details.forEach(([label, value]) => {
            doc.setFont(undefined, 'normal');
            doc.setTextColor(textLight[0], textLight[1], textLight[2]);
            doc.text(label, 20, y);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text(value, 70, y);
            y += 7;
        });
        
        // Notes if present
        if (donation.notes) {
            y += 8;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text('Message:', 20, y);
            y += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(textLight[0], textLight[1], textLight[2]);
            const splitNotes = doc.splitTextToSize(donation.notes, pageWidth - 40);
            doc.text(splitNotes, 20, y);
            y += splitNotes.length * 5 + 10;
        }
        
        // Anonymous notice
        if (donation.is_anonymous) {
            y += 5;
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(textLight[0], textLight[1], textLight[2]);
            doc.text('This donation has been marked as anonymous.', 20, y);
            y += 10;
        }
        
        // Tax Information Box
        y = Math.max(y + 10, 230);
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFillColor(243, 232, 255);
        doc.roundedRect(15, y, pageWidth - 30, 30, 3, 3, 'FD');
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Tax-Deductible Contribution', 20, y + 8);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        const taxText = doc.splitTextToSize(
            'This receipt serves as official documentation of your charitable contribution. Church Connect is a registered 501(c)(3) nonprofit organization. Please retain this receipt for your tax records. No goods or services were provided in exchange for this donation.',
            pageWidth - 40
        );
        doc.text(taxText, 20, y + 15);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text('Thank you for your generous support!', pageWidth / 2, 280, { align: 'center' });
        doc.text('Church Connect • Donation Management System', pageWidth / 2, 285, { align: 'center' });
        
        // Save PDF
        doc.save(`receipt-${donation.transaction_id}.pdf`);
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
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
                            <h3 className="font-semibold text-slate-900">{fundInfo.label}</h3>
                            <p className="text-sm text-slate-500">
                                {format(new Date(donation.created_date), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                            R{donation.amount.toFixed(2)}
                        </p>
                        <Badge className={cn("text-xs flex items-center gap-1 mt-1", statusInfo.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="capitalize">{donation.donation_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard className="h-4 w-4" />
                        <span className="capitalize">{donation.payment_method}</span>
                    </div>
                </div>

                {donation.donation_type !== "one_time" && donation.next_charge_date && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Next charge:</strong> {format(new Date(donation.next_charge_date), 'MMM dd, yyyy')}
                        </p>
                    </div>
                )}

                {donation.notes && (
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm text-slate-600 italic">"{donation.notes}"</p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-slate-500">ID: {donation.transaction_id}</span>
                    <Button
                        onClick={handleDownloadReceipt}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download Receipt
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}