import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Calendar,
    Users,
    Edit,
    Trash2,
    AlertTriangle,
    Megaphone,
    PartyPopper,
    Heart,
    Info
} from "lucide-react";
import { format } from "date-fns";

const typeConfig = {
    general: { 
        icon: Info, 
        color: "bg-blue-100 text-blue-700 border-blue-200",
        iconColor: "text-blue-600"
    },
    urgent: { 
        icon: AlertTriangle, 
        color: "bg-red-100 text-red-700 border-red-200",
        iconColor: "text-red-600"
    },
    event: { 
        icon: Calendar, 
        color: "bg-purple-100 text-purple-700 border-purple-200",
        iconColor: "text-purple-600"
    },
    prayer_request: { 
        icon: Heart, 
        color: "bg-pink-100 text-pink-700 border-pink-200",
        iconColor: "text-pink-600"
    },
    celebration: { 
        icon: PartyPopper, 
        color: "bg-amber-100 text-amber-700 border-amber-200",
        iconColor: "text-amber-600"
    },
};

export default function AnnouncementCard({ announcement, onEdit, onDelete, isAdmin }) {
    const config = typeConfig[announcement.announcement_type] || typeConfig.general;
    const Icon = config.icon;

    const isExpired = announcement.expires_date && new Date(announcement.expires_date) < new Date();

    return (
        <Card className={`overflow-hidden border-slate-100 hover:shadow-lg transition-all duration-300 group ${
            isExpired ? 'opacity-60' : ''
        }`}>
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        announcement.announcement_type === 'urgent' 
                            ? 'bg-red-100' 
                            : 'bg-purple-100'
                    }`}>
                        <Icon className={`h-7 w-7 ${config.iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className={`${config.color} border text-xs`}>
                                        {announcement.announcement_type.replace(/_/g, ' ')}
                                    </Badge>
                                    {announcement.target_audience !== 'all' && (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                                            <Users className="h-3 w-3 mr-1" />
                                            {announcement.target_audience}
                                        </Badge>
                                    )}
                                    {!announcement.is_active && (
                                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-xs">
                                            Inactive
                                        </Badge>
                                    )}
                                    {isExpired && (
                                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                                            Expired
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {announcement.title}
                                </h3>
                            </div>
                        </div>

                        {/* Image */}
                        {announcement.image_url && (
                            <div className="mb-4">
                                <img 
                                    src={announcement.image_url} 
                                    alt={announcement.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <p className="text-slate-600 whitespace-pre-wrap mb-4 leading-relaxed">
                            {announcement.content}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-4 border-b border-slate-100">
                            <span className="flex items-center gap-1">
                                <Megaphone className="h-4 w-4" />
                                By {announcement.published_by}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(announcement.published_date), "MMM d, yyyy")}
                            </span>
                            {announcement.expires_date && (
                                <span className="flex items-center gap-1 text-amber-600">
                                    Expires: {format(new Date(announcement.expires_date), "MMM d, yyyy")}
                                </span>
                            )}
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && (
                            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(announcement)}
                                    className="text-slate-600"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(announcement)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}