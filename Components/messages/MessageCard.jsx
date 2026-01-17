import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Mail, 
    MailOpen,
    Clock,
    AlertCircle,
    CheckCircle2,
    Reply
} from "lucide-react";
import { format } from "date-fns";

const priorityColors = {
    normal: "bg-slate-100 text-slate-700 border-slate-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    urgent: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    read: "bg-slate-100 text-slate-700 border-slate-200",
    replied: "bg-green-100 text-green-700 border-green-200",
};

const statusIcons = {
    new: Mail,
    read: MailOpen,
    replied: CheckCircle2,
};

export default function MessageCard({ message, onReply, onViewDetails, isAdmin }) {
    const StatusIcon = statusIcons[message.status] || Mail;

    return (
        <Card className="border-slate-100 hover:shadow-md transition-all duration-300 group">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.status === 'new' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-slate-100 text-slate-500'
                    }`}>
                        <StatusIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-800 text-lg truncate">
                                    {message.subject}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    From: {message.sender_name} ({message.sender_email})
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <Badge variant="outline" className={`${statusColors[message.status]} border text-xs`}>
                                    {message.status}
                                </Badge>
                                {message.priority !== 'normal' && (
                                    <Badge variant="outline" className={`${priorityColors[message.priority]} border text-xs`}>
                                        {message.priority}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Message Preview */}
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {message.content}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {message.created_date ? format(new Date(message.created_date), "MMM d, yyyy 'at' h:mm a") : "Just now"}
                            </span>
                            {message.sender_type && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                                    {message.sender_type}
                                </Badge>
                            )}
                            {message.recipient_type === 'ministry' && message.ministry_name && (
                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                                    {message.ministry_name?.replace(/_/g, ' ')}
                                </Badge>
                            )}
                            {message.sender_id && (
                                <span className="font-mono text-xs">
                                    ID: {message.sender_id}
                                </span>
                            )}
                        </div>

                        {/* Reply Preview */}
                        {message.reply_content && (
                            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Reply className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-emerald-700 mb-1">
                                            Reply from {message.replied_by}
                                        </p>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {message.reply_content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {isAdmin && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewDetails(message)}
                                    className="text-slate-600"
                                >
                                    <MailOpen className="h-4 w-4 mr-1" />
                                    View Details
                                </Button>
                                {message.status !== 'replied' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onReply(message)}
                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                    >
                                        <Reply className="h-4 w-4 mr-1" />
                                        Reply
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}