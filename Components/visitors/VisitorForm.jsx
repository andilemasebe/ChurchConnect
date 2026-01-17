import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";

const howHeardOptions = [
    { value: "friend", label: "Friend/Family" },
    { value: "social_media", label: "Social Media" },
    { value: "website", label: "Website" },
    { value: "drive_by", label: "Drove By" },
    { value: "event", label: "Church Event" },
    { value: "other", label: "Other" },
];

const followUpStatuses = [
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "completed", label: "Completed" },
    { value: "converted_to_member", label: "Converted to Member" },
];

export default function VisitorForm({ visitor, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        visitor_id: "",
        email: "",
        phone: "",
        address: "",
        first_visit_date: new Date().toISOString().split("T")[0],
        how_heard: "",
        prayer_request: "",
        interested_in_membership: false,
        follow_up_status: "pending",
        visit_count: 1,
        notes: "",
    });

    useEffect(() => {
        if (visitor) {
            setFormData({ ...formData, ...visitor });
        } else {
            const newId = `VIS-${Date.now().toString(36).toUpperCase()}`;
            setFormData(prev => ({ ...prev, visitor_id: newId }));
        }
    }, [visitor]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-purple-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {visitor ? "Edit Visitor" : "Add New Visitor"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                    required
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                    required
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="visitor_id">Visitor ID</Label>
                                <Input
                                    id="visitor_id"
                                    value={formData.visitor_id}
                                    onChange={(e) => handleChange("visitor_id", e.target.value)}
                                    placeholder="Auto-generated"
                                    readOnly
                                    className="bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="first_visit_date">First Visit Date</Label>
                                <Input
                                    id="first_visit_date"
                                    type="date"
                                    value={formData.first_visit_date}
                                    onChange={(e) => handleChange("first_visit_date", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    placeholder="Enter full address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visit Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Visit Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="how_heard">How Did They Hear About Us?</Label>
                                <Select
                                    value={formData.how_heard}
                                    onValueChange={(value) => handleChange("how_heard", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {howHeardOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="follow_up_status">Follow-up Status</Label>
                                <Select
                                    value={formData.follow_up_status}
                                    onValueChange={(value) => handleChange("follow_up_status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {followUpStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="prayer_request">Prayer Request</Label>
                                <Textarea
                                    id="prayer_request"
                                    value={formData.prayer_request}
                                    onChange={(e) => handleChange("prayer_request", e.target.value)}
                                    placeholder="Any prayer requests..."
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                    placeholder="Additional notes..."
                                    rows={2}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="interested_in_membership"
                                    checked={formData.interested_in_membership}
                                    onCheckedChange={(checked) => handleChange("interested_in_membership", checked)}
                                />
                                <Label htmlFor="interested_in_membership">Interested in Membership</Label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-amber-500 hover:bg-amber-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {visitor ? "Update Visitor" : "Add Visitor"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}