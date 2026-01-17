import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";

const ministryKeys = [
    { value: "choir", label: "Choir" },
    { value: "ushering", label: "Ushering" },
    { value: "prayer_team", label: "Prayer Team" },
    { value: "youth_ministry", label: "Youth Ministry" },
    { value: "children_ministry", label: "Children Ministry" },
    { value: "media_team", label: "Media Team" },
    { value: "welfare", label: "Welfare" },
    { value: "evangelism", label: "Evangelism" },
    { value: "other", label: "Other" },
];

export default function MinistryForm({ ministry, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        name: "",
        ministry_key: "choir",
        description: "",
        leader_name: "",
        leader_email: "",
        leader_id: "",
        meeting_schedule: "",
        is_active: true,
    });

    useEffect(() => {
        if (ministry) {
            setFormData({ ...formData, ...ministry });
        }
    }, [ministry]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {ministry ? "Edit Ministry" : "Create New Ministry"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ministry Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                placeholder="e.g., Worship Team"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ministry_key">Ministry Key *</Label>
                            <Select
                                value={formData.ministry_key}
                                onValueChange={(value) => handleChange("ministry_key", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ministryKeys.map((key) => (
                                        <SelectItem key={key.value} value={key.value}>
                                            {key.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Ministry description and purpose..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leader_name">Leader Name</Label>
                            <Input
                                id="leader_name"
                                value={formData.leader_name}
                                onChange={(e) => handleChange("leader_name", e.target.value)}
                                placeholder="Ministry leader"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leader_email">Leader Email</Label>
                            <Input
                                id="leader_email"
                                type="email"
                                value={formData.leader_email}
                                onChange={(e) => handleChange("leader_email", e.target.value)}
                                placeholder="leader@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leader_id">Leader Member ID</Label>
                            <Input
                                id="leader_id"
                                value={formData.leader_id}
                                onChange={(e) => handleChange("leader_id", e.target.value)}
                                placeholder="e.g., MEM-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meeting_schedule">Meeting Schedule</Label>
                            <Input
                                id="meeting_schedule"
                                value={formData.meeting_schedule}
                                onChange={(e) => handleChange("meeting_schedule", e.target.value)}
                                placeholder="e.g., Every Sunday at 8:00 AM"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleChange("is_active", checked)}
                            />
                            <Label htmlFor="is_active">Active Ministry</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {ministry ? "Update" : "Create"} Ministry
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}