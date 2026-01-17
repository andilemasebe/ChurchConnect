import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    User, 
    Mail, 
    Phone, 
    Edit, 
    Trash2,
    Heart,
    Droplets,
    Calendar
} from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
    adult: "bg-purple-100 text-purple-700 border-purple-200",
    youth: "bg-blue-100 text-blue-700 border-blue-200",
    teenager: "bg-cyan-100 text-cyan-700 border-cyan-200",
    child: "bg-pink-100 text-pink-700 border-pink-200",
    senior: "bg-amber-100 text-amber-700 border-amber-200",
};

const salvationColors = {
    saved: "bg-emerald-100 text-emerald-700",
    not_saved: "bg-slate-100 text-slate-600",
    rededicated: "bg-purple-100 text-purple-700",
};

const baptismColors = {
    baptized: "bg-blue-100 text-blue-700",
    not_baptized: "bg-slate-100 text-slate-600",
    scheduled: "bg-amber-100 text-amber-700",
};

export default function MemberCard({ member, onEdit, onDelete }) {
    return (
        <Card className="overflow-hidden border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-slate-800 text-lg">
                                    {member.first_name} {member.last_name}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    ID: {member.member_id}
                                </p>
                            </div>
                            <Badge className={`${categoryColors[member.category]} border text-xs`}>
                                {member.category}
                            </Badge>
                        </div>

                        {/* Contact */}
                        <div className="mt-3 space-y-1">
                            {member.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            )}
                            {member.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>{member.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {member.salvation_status && (
                                <Badge variant="secondary" className={`${salvationColors[member.salvation_status]} text-xs`}>
                                    <Heart className="h-3 w-3 mr-1" />
                                    {member.salvation_status.replace("_", " ")}
                                </Badge>
                            )}
                            {member.baptism_status && (
                                <Badge variant="secondary" className={`${baptismColors[member.baptism_status]} text-xs`}>
                                    <Droplets className="h-3 w-3 mr-1" />
                                    {member.baptism_status.replace("_", " ")}
                                </Badge>
                            )}
                        </div>

                        {/* Ministry & Join Date */}
                        {(member.ministry || member.join_date) && (
                            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                                {member.ministry && (
                                    <span className="bg-slate-50 px-2 py-1 rounded">
                                        {member.ministry}
                                    </span>
                                )}
                                {member.join_date && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Joined {format(new Date(member.join_date), "MMM yyyy")}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(member)}
                        className="text-slate-600"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(member)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Active Status Indicator */}
            {!member.is_active && (
                <div className="bg-slate-100 text-slate-500 text-xs text-center py-1.5">
                    Inactive Member
                </div>
            )}
        </Card>
    );
}