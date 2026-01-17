import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const eventTypes = [
    { value: "bible_study", label: "Bible Study" },
    { value: "outreach", label: "Outreach Program" },
    { value: "special_service", label: "Special Service" },
    { value: "prayer_meeting", label: "Prayer Meeting" },
    { value: "youth_event", label: "Youth Event" },
    { value: "children_event", label: "Children Event" },
    { value: "conference", label: "Conference" },
    { value: "retreat", label: "Retreat" },
    { value: "workshop", label: "Workshop" },
    { value: "fellowship", label: "Fellowship" },
    { value: "other", label: "Other" },
];

export default function EventForm({ event, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_type: "bible_study",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
        capacity: "",
        rsvp_enabled: true,
        organizer: "",
        image_url: "",
        is_active: true,
    });

    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await base44.auth.me();
                setFormData(prev => ({
                    ...prev,
                    organizer: user.full_name || user.email || "Church Admin",
                }));
            } catch (error) {
                setFormData(prev => ({ ...prev, organizer: "Church Admin" }));
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (event) {
            setFormData({ ...formData, ...event });
        }
    }, [event]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingImage(true);
            try {
                const result = await base44.integrations.Core.UploadFile({ file });
                handleChange("image_url", result.file_url);
            } catch (error) {
                console.error("Failed to upload image:", error);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-emerald-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {event ? "Edit Event" : "Create New Event"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                required
                                placeholder="Enter event title"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Event description..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event_type">Event Type</Label>
                            <Select
                                value={formData.event_type}
                                onValueChange={(value) => handleChange("event_type", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event_date">Event Date *</Label>
                            <Input
                                id="event_date"
                                type="date"
                                value={formData.event_date}
                                onChange={(e) => handleChange("event_date", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time *</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={formData.start_time}
                                onChange={(e) => handleChange("start_time", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={formData.end_time}
                                onChange={(e) => handleChange("end_time", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                required
                                placeholder="Event location"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Max Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => handleChange("capacity", e.target.value)}
                                placeholder="Leave empty for unlimited"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organizer">Organizer</Label>
                            <Input
                                id="organizer"
                                value={formData.organizer}
                                onChange={(e) => handleChange("organizer", e.target.value)}
                                placeholder="Event organizer"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="image">Event Image (Optional)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                            {uploadingImage && <p className="text-sm text-purple-600">Uploading...</p>}
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" className="h-32 w-auto rounded-lg mt-2" />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="rsvp_enabled"
                                checked={formData.rsvp_enabled}
                                onCheckedChange={(checked) => handleChange("rsvp_enabled", checked)}
                            />
                            <Label htmlFor="rsvp_enabled">Enable RSVP</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleChange("is_active", checked)}
                            />
                            <Label htmlFor="is_active">Active Event</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {event ? "Update" : "Create"} Event
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}