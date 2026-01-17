import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ministries = [
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

const priorities = [
    { value: "normal", label: "Normal" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
];

export default function MessageForm({ onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        sender_name: "",
        sender_email: "",
        sender_id: "",
        sender_type: "member",
        recipient_type: "admin",
        ministry_name: "",
        subject: "",
        content: "",
        priority: "normal",
        status: "new",
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [ministries, setMinistries] = useState([]);

    useEffect(() => {
        // Load ministries
        const loadMinistries = async () => {
            try {
                const data = await base44.entities.Ministry.list();
                setMinistries(data.filter(m => m.is_active));
            } catch (error) {
                console.error("Failed to load ministries:", error);
            }
        };
        loadMinistries();
    }, []);

    useEffect(() => {
        // Check URL params for pre-filled ministry
        const params = new URLSearchParams(window.location.search);
        const ministryKey = params.get("ministry");
        const ministryName = params.get("name");
        if (ministryKey && ministryName) {
            setFormData(prev => ({
                ...prev,
                recipient_type: "ministry",
                ministry_name: ministryKey,
            }));
        }
    }, []);

    useEffect(() => {
        // Try to get current user
        const loadUser = async () => {
            try {
                const user = await base44.auth.me();
                setCurrentUser(user);
                setFormData(prev => ({
                    ...prev,
                    sender_name: user.full_name || "",
                    sender_email: user.email || "",
                    sender_type: user.role === "admin" ? "admin" : "member",
                }));
            } catch (error) {
                // User not logged in
            }
        };
        loadUser();
    }, []);

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
                        Send Message
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Your Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sender_name">Your Name *</Label>
                                <Input
                                    id="sender_name"
                                    value={formData.sender_name}
                                    onChange={(e) => handleChange("sender_name", e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sender_email">Your Email *</Label>
                                <Input
                                    id="sender_email"
                                    type="email"
                                    value={formData.sender_email}
                                    onChange={(e) => handleChange("sender_email", e.target.value)}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sender_id">Member/Visitor ID</Label>
                                <Input
                                    id="sender_id"
                                    value={formData.sender_id}
                                    onChange={(e) => handleChange("sender_id", e.target.value)}
                                    placeholder="e.g., MEM-001 or VIS-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sender_type">You are a *</Label>
                                <Select
                                    value={formData.sender_type}
                                    onValueChange={(value) => handleChange("sender_type", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="visitor">Visitor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Message Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Message Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="recipient_type">Send To *</Label>
                                <Select
                                    value={formData.recipient_type}
                                    onValueChange={(value) => {
                                        handleChange("recipient_type", value);
                                        if (value === "admin") {
                                            handleChange("ministry_name", "");
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Church Administrator</SelectItem>
                                        <SelectItem value="ministry">Specific Ministry</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.recipient_type === "ministry" && (
                                <div className="space-y-2">
                                    <Label htmlFor="ministry_name">Select Ministry *</Label>
                                    <Select
                                        value={formData.ministry_name}
                                        onValueChange={(value) => handleChange("ministry_name", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose ministry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ministries.length > 0 ? (
                                                ministries.map((ministry) => (
                                                    <SelectItem key={ministry.ministry_key} value={ministry.ministry_key}>
                                                        {ministry.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>No ministries available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => handleChange("priority", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority) => (
                                            <SelectItem key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                required
                                placeholder="What is your message about?"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Message *</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => handleChange("content", e.target.value)}
                                required
                                placeholder="Write your message here..."
                                rows={6}
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
                                <Send className="h-4 w-4 mr-2" />
                            )}
                            Send Message
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}