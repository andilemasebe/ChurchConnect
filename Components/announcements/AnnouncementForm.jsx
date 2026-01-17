import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2, Upload } from "lucide-react";
import { page24 } from "@/api/page24Client";

const announcementTypes = [
    { value: "general", label: "General Announcement" },
    { value: "urgent", label: "Urgent Notice" },
    { value: "event", label: "Event/Program" },
    { value: "prayer_request", label: "Prayer Request" },
    { value: "celebration", label: "Celebration" },
];

const audiences = [
    { value: "all", label: "Everyone" },
    { value: "members", label: "Members Only" },
    { value: "visitors", label: "Visitors Only" },
    { value: "youth", label: "Youth" },
    { value: "children", label: "Children" },
    { value: "seniors", label: "Seniors" },
];

export default function AnnouncementForm({ announcement, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        announcement_type: "general",
        published_by: "",
        published_date: new Date().toISOString().split("T")[0],
        target_audience: "all",
        is_active: true,
        expires_date: "",
        image_url: "",
    });

    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await page24.auth.me();
                setFormData(prev => ({
                    ...prev,
                    published_by: user.full_name || user.email || "Admin",
                }));
            } catch (error) {
                setFormData(prev => ({
                    ...prev,
                    published_by: "Church Admin",
                }));
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (announcement) {
            setFormData({ ...formData, ...announcement });
        }
    }, [announcement]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingImage(true);
            try {
                const result = await page24.integrations.Core.UploadFile({ file });
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
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-amber-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {announcement ? "Edit Announcement" : "Create New Announcement"}
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
                        <div className="space-y-2">
                            <Label htmlFor="title">Announcement Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                required
                                placeholder="Enter announcement title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => handleChange("content", e.target.value)}
                                required
                                placeholder="Write the announcement details..."
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="announcement_type">Type</Label>
                                <Select
                                    value={formData.announcement_type}
                                    onValueChange={(value) => handleChange("announcement_type", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {announcementTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target_audience">Target Audience</Label>
                                <Select
                                    value={formData.target_audience}
                                    onValueChange={(value) => handleChange("target_audience", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {audiences.map((audience) => (
                                            <SelectItem key={audience.value} value={audience.value}>
                                                {audience.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="published_date">Published Date</Label>
                                <Input
                                    id="published_date"
                                    type="date"
                                    value={formData.published_date}
                                    onChange={(e) => handleChange("published_date", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expires_date">Expires Date (Optional)</Label>
                                <Input
                                    id="expires_date"
                                    type="date"
                                    value={formData.expires_date}
                                    onChange={(e) => handleChange("expires_date", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="image">Image (Optional)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="flex-1"
                                    />
                                    {uploadingImage && (
                                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                                    )}
                                </div>
                                {formData.image_url && (
                                    <div className="mt-2">
                                        <img 
                                            src={formData.image_url} 
                                            alt="Preview" 
                                            className="h-32 w-auto rounded-lg border border-slate-200"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => handleChange("is_active", checked)}
                                />
                                <Label htmlFor="is_active">Active Announcement</Label>
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
                            {announcement ? "Update" : "Publish"} Announcement
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}