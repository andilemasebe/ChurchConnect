import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Users,
    Mail,
    Calendar,
    Edit,
    Trash2,
    MessageSquare,
    UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MinistryCard({ ministry, onEdit, onDelete, onAddMembers, onSendMessage, isAdmin, memberCount }) {
    return (
        <Card className="overflow-hidden border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{ministry.name}</h3>
                        {!ministry.is_active && (
                            <Badge variant="outline" className="bg-slate-100 text-slate-500 mb-2">
                                Inactive
                            </Badge>
                        )}
                    </div>
                </div>

                {ministry.description && (
                    <p className="text-slate-600 mb-4 line-clamp-2">{ministry.description}</p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                    {ministry.leader_name && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span>Leader: {ministry.leader_name}</span>
                        </div>
                    )}
                    {ministry.leader_email && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="truncate">{ministry.leader_email}</span>
                        </div>
                    )}
                    {ministry.meeting_schedule && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <span>{ministry.meeting_schedule}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600 pt-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {memberCount || ministry.member_count || 0} Members
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendMessage(ministry)}
                        className="text-purple-600"
                    >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                    </Button>
                    {isAdmin && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAddMembers(ministry)}
                                className="text-emerald-600"
                            >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Add Members
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(ministry)}
                                className="text-slate-600 ml-auto"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(ministry)}
                                className="text-red-500"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}