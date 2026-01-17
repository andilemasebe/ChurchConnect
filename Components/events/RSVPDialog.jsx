import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function RSVPDialog({ event, open, onClose, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        attendee_name: "",
        attendee_email: "",
        attendee_id: "",
        attendee_type: "member",
        guests_count: 0,
        notes: "",
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await base44.auth.me();
                setFormData(prev => ({
                    ...prev,
                    attendee_name: user.full_name || "",
                    attendee_email: user.email || "",
                }));
            } catch (error) {
                // Not logged in
            }
        };
        if (open) loadUser();
    }, [open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            event_id: event.id,
            event_title: event.title,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>RSVP for Event</DialogTitle>
                    <DialogDescription>{event?.title}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                            id="name"
                            value={formData.attendee_name}
                            onChange={(e) => setFormData({...formData, attendee_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.attendee_email}
                            onChange={(e) => setFormData({...formData, attendee_email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="member_id">Member/Visitor ID</Label>
                        <Input
                            id="member_id"
                            value={formData.attendee_id}
                            onChange={(e) => setFormData({...formData, attendee_id: e.target.value})}
                            placeholder="e.g., MEM-001"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                            id="guests"
                            type="number"
                            min="0"
                            value={formData.guests_count}
                            onChange={(e) => setFormData({...formData, guests_count: parseInt(e.target.value) || 0})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Special Requests/Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            rows={2}
                            placeholder="Any special requests or dietary requirements?"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Confirm RSVP
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}