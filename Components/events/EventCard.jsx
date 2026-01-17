import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Calendar,
    Clock,
    MapPin,
    Users,
    Edit,
    Trash2,
    CheckCircle2,
    Download
} from "lucide-react";
import { format } from "date-fns";

const typeColors = {
    bible_study: "bg-blue-100 text-blue-700 border-blue-200",
    outreach: "bg-green-100 text-green-700 border-green-200",
    special_service: "bg-purple-100 text-purple-700 border-purple-200",
    prayer_meeting: "bg-pink-100 text-pink-700 border-pink-200",
    youth_event: "bg-cyan-100 text-cyan-700 border-cyan-200",
    children_event: "bg-amber-100 text-amber-700 border-amber-200",
    conference: "bg-indigo-100 text-indigo-700 border-indigo-200",
    retreat: "bg-emerald-100 text-emerald-700 border-emerald-200",
    workshop: "bg-orange-100 text-orange-700 border-orange-200",
    fellowship: "bg-rose-100 text-rose-700 border-rose-200",
    other: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function EventCard({ event, onEdit, onDelete, onRSVP, userRSVP, isAdmin }) {
    const isPastEvent = new Date(event.event_date) < new Date();
    const isFullyBooked = event.capacity && event.rsvp_count >= event.capacity;

    const handleAddToCalendar = () => {
        const startDate = new Date(`${event.event_date}T${event.start_time || '00:00'}`);
        const endDate = event.end_time 
            ? new Date(`${event.event_date}T${event.end_time}`) 
            : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const formatDateForCalendar = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}`;
        
        window.open(calendarUrl, '_blank');
    };

    return (
        <Card className={`overflow-hidden border-slate-100 hover:shadow-lg transition-all duration-300 group ${isPastEvent ? 'opacity-60' : ''}`}>
            {event.image_url && (
                <div className="h-48 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className={`${typeColors[event.event_type]} border text-xs`}>
                                {event.event_type?.replace(/_/g, ' ')}
                            </Badge>
                            {userRSVP && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    You're attending
                                </Badge>
                            )}
                            {isPastEvent && (
                                <Badge variant="outline" className="bg-slate-100 text-slate-500 text-xs">
                                    Past Event
                                </Badge>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                    </div>
                </div>

                {event.description && (
                    <p className="text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>{format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{event.start_time}{event.end_time && ` - ${event.end_time}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span>{event.location}</span>
                    </div>
                    {event.rsvp_enabled && (
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-amber-500" />
                            <span>
                                {event.rsvp_count || 0} RSVP'd
                                {event.capacity && ` / ${event.capacity} capacity`}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                    {!isPastEvent && event.rsvp_enabled && !userRSVP && (
                        <Button
                            size="sm"
                            onClick={() => onRSVP(event)}
                            disabled={isFullyBooked}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {isFullyBooked ? "Event Full" : "RSVP"}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddToCalendar}
                        className="text-purple-600"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Add to Calendar
                    </Button>
                    {isAdmin && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(event)}
                                className="text-slate-600 ml-auto"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(event)}
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