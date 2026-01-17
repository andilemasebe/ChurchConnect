import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Mail, 
    Phone, 
    Edit, 
    Trash2,
    Calendar,
    UserPlus,
    MessageCircle,
    Star
} from "lucide-react";
import { format } from "date-fns";

const followUpColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    contacted: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    converted_to_member: "bg-purple-100 text-purple-700 border-purple-200",
};

const howHeardLabels = {
    friend: "Friend/Family",
    family: "Family",
    social_media: "Social Media",
    website: "Website",
    drive_by: "Drove By",
    event: "Church Event",
    other: "Other",
};

export default function VisitorCard({ visitor, onEdit, onDelete, onConvertToMember }) {
    return (
        <Card className="overflow-hidden border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                        {visitor.first_name?.[0]}{visitor.last_name?.[0]}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-slate-800 text-lg">
                                    {visitor.first_name} {visitor.last_name}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    ID: {visitor.visitor_id}
                                </p>
                            </div>
                            <Badge className={`${followUpColors[visitor.follow_up_status]} border text-xs`}>
                                {visitor.follow_up_status?.replace(/_/g, " ")}
                            </Badge>
                        </div>

                        {/* Contact */}
                        <div className="mt-3 space-y-1">
                            {visitor.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span className="truncate">{visitor.email}</span>
                                </div>
                            )}
                            {visitor.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>{visitor.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {visitor.first_visit_date && (
                                <Badge variant="outline" className="text-xs bg-slate-50">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    First visit: {format(new Date(visitor.first_visit_date), "MMM d, yyyy")}
                                </Badge>
                            )}
                            {visitor.visit_count > 1 && (
                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {visitor.visit_count} visits
                                </Badge>
                            )}
                            {visitor.interested_in_membership && (
                                <Badge className="text-xs bg-purple-100 text-purple-700">
                                    <Star className="h-3 w-3 mr-1" />
                                    Interested in Membership
                                </Badge>
                            )}
                        </div>

                        {/* How Heard & Prayer Request */}
                        <div className="mt-3 space-y-2">
                            {visitor.how_heard && (
                                <p className="text-xs text-slate-400">
                                    <span className="font-medium">How heard:</span> {howHeardLabels[visitor.how_heard]}
                                </p>
                            )}
                            {visitor.prayer_request && (
                                <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                    <MessageCircle className="h-3.5 w-3.5 mt-0.5 text-purple-500" />
                                    <span className="line-clamp-2">{visitor.prayer_request}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    {visitor.follow_up_status !== "converted_to_member" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onConvertToMember(visitor)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Convert to Member
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(visitor)}
                        className="text-slate-600"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(visitor)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    );
}