import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";

const categories = [
    { value: "adult", label: "Adult" },
    { value: "youth", label: "Youth (18-25)" },
    { value: "teenager", label: "Teenager (13-17)" },
    { value: "child", label: "Child (0-12)" },
    { value: "senior", label: "Senior (60+)" },
];

const salvationStatuses = [
    { value: "saved", label: "Saved" },
    { value: "not_saved", label: "Not Saved" },
    { value: "rededicated", label: "Rededicated" },
];

const baptismStatuses = [
    { value: "baptized", label: "Baptized" },
    { value: "not_baptized", label: "Not Baptized" },
    { value: "scheduled", label: "Scheduled for Baptism" },
];

const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
];

export default function MemberForm({ member, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        member_id: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
        category: "",
        salvation_status: "",
        baptism_status: "",
        baptism_date: "",
        salvation_date: "",
        join_date: "",
        ministry: "",
        notes: "",
        is_active: true,
    });

    useEffect(() => {
        if (member) {
            setFormData({ ...formData, ...member });
        } else {
            // Generate unique member ID
            const newId = `MEM-${Date.now().toString(36).toUpperCase()}`;
            setFormData(prev => ({ ...prev, member_id: newId }));
        }
    }, [member]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-amber-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {member ? "Edit Member" : "Add New Member"}
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
                                <Label htmlFor="member_id">Member ID *</Label>
                                <Input
                                    id="member_id"
                                    value={formData.member_id}
                                    onChange={(e) => handleChange("member_id", e.target.value)}
                                    required
                                    placeholder="Unique member ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleChange("category", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleChange("gender", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genders.map((g) => (
                                            <SelectItem key={g.value} value={g.value}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
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

                    {/* Spiritual Status */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Spiritual Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salvation_status">Salvation Status</Label>
                                <Select
                                    value={formData.salvation_status}
                                    onValueChange={(value) => handleChange("salvation_status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salvationStatuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salvation_date">Salvation Date</Label>
                                <Input
                                    id="salvation_date"
                                    type="date"
                                    value={formData.salvation_date}
                                    onChange={(e) => handleChange("salvation_date", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="baptism_status">Baptism Status</Label>
                                <Select
                                    value={formData.baptism_status}
                                    onValueChange={(value) => handleChange("baptism_status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {baptismStatuses.map((b) => (
                                            <SelectItem key={b.value} value={b.value}>
                                                {b.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="baptism_date">Baptism Date</Label>
                                <Input
                                    id="baptism_date"
                                    type="date"
                                    value={formData.baptism_date}
                                    onChange={(e) => handleChange("baptism_date", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Church Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Church Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="join_date">Join Date</Label>
                                <Input
                                    id="join_date"
                                    type="date"
                                    value={formData.join_date}
                                    onChange={(e) => handleChange("join_date", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ministry">Ministry/Department</Label>
                                <Input
                                    id="ministry"
                                    value={formData.ministry}
                                    onChange={(e) => handleChange("ministry", e.target.value)}
                                    placeholder="e.g., Choir, Ushering"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                    placeholder="Additional notes..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => handleChange("is_active", checked)}
                                />
                                <Label htmlFor="is_active">Active Member</Label>
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
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {member ? "Update Member" : "Add Member"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}