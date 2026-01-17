import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Megaphone, 
    Search,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Announcements() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await base44.auth.me();
                setCurrentUser(user);
                setIsAdmin(user.role === "admin");
            } catch (error) {
                setIsAdmin(false);
            }
        };
        loadUser();
    }, []);

    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ["announcements"],
        queryFn: () => base44.entities.Announcement.list("-published_date"),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Announcement.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            setShowForm(false);
            setEditingAnnouncement(null);
            toast.success("Announcement published successfully!");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Announcement.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            setShowForm(false);
            setEditingAnnouncement(null);
            toast.success("Announcement updated successfully!");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Announcement.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            setDeletingAnnouncement(null);
            toast.success("Announcement deleted successfully!");
        },
    });

    const handleSave = (data) => {
        if (editingAnnouncement) {
            updateMutation.mutate({ id: editingAnnouncement.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setShowForm(true);
    };

    const handleDelete = (announcement) => {
        setDeletingAnnouncement(announcement);
    };

    const confirmDelete = () => {
        if (deletingAnnouncement) {
            deleteMutation.mutate(deletingAnnouncement.id);
        }
    };

    // Filter announcements - show active ones to non-admins
    const filteredAnnouncements = announcements.filter((announcement) => {
        // Non-admins only see active announcements
        if (!isAdmin && !announcement.is_active) {
            return false;
        }

        // Check if expired
        const isExpired = announcement.expires_date && new Date(announcement.expires_date) < new Date();
        if (!isAdmin && isExpired) {
            return false;
        }

        const matchesSearch = 
            announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.published_by?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = typeFilter === "all" || announcement.announcement_type === typeFilter;

        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-amber-50/20 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Announcements</h1>
                        <p className="text-slate-500">
                            {isAdmin ? "Broadcast important updates to the church" : "Stay updated with church announcements"}
                        </p>
                    </div>
                    {isAdmin && (
                        <Button 
                            onClick={() => { setEditingAnnouncement(null); setShowForm(true); }}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Announcement
                        </Button>
                    )}
                </div>

                {/* Form Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <AnnouncementForm
                                announcement={editingAnnouncement}
                                onSave={handleSave}
                                onCancel={() => { setShowForm(false); setEditingAnnouncement(null); }}
                                isLoading={createMutation.isPending || updateMutation.isPending}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters */}
                {!showForm && (
                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search announcements..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="prayer_request">Prayer Request</SelectItem>
                                    <SelectItem value="celebration">Celebration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Announcements Grid */}
                {!showForm && (
                    <div className="space-y-6">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-64 rounded-xl" />
                            ))
                        ) : filteredAnnouncements.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
                                <Megaphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-700">No announcements found</h3>
                                <p className="text-slate-500 mt-1">
                                    {searchQuery || typeFilter !== "all" 
                                        ? "Try adjusting your filters" 
                                        : isAdmin 
                                            ? "Create your first announcement to get started"
                                            : "Check back later for updates"}
                                </p>
                            </div>
                        ) : (
                            filteredAnnouncements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isAdmin={isAdmin}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingAnnouncement} onOpenChange={() => setDeletingAnnouncement(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{deletingAnnouncement?.title}"? 
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}