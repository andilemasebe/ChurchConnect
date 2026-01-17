import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    ClipboardCheck, 
    Calendar, 
    Users, 
    UserCheck, 
    UserPlus,
    Clock,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import CheckInSearch from "@/components/checkin/CheckInSearch";
import { motion } from "framer-motion";

const serviceTypes = [
    { value: "sunday_service", label: "Sunday Service" },
    { value: "wednesday_service", label: "Wednesday Service" },
    { value: "friday_service", label: "Friday Service" },
    { value: "prayer_meeting", label: "Prayer Meeting" },
    { value: "bible_study", label: "Bible Study" },
    { value: "youth_service", label: "Youth Service" },
    { value: "special_event", label: "Special Event" },
    { value: "other", label: "Other" },
];

export default function CheckIn() {
    const queryClient = useQueryClient();
    const today = format(new Date(), "yyyy-MM-dd");
    const [selectedService, setSelectedService] = useState("sunday_service");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [checkInError, setCheckInError] = useState(null);

    const { data: members = [] } = useQuery({
        queryKey: ["members"],
        queryFn: () => base44.entities.Member.list(),
    });

    const { data: visitors = [] } = useQuery({
        queryKey: ["visitors"],
        queryFn: () => base44.entities.Visitor.list(),
    });

    const { data: todayAttendance = [], refetch: refetchAttendance } = useQuery({
        queryKey: ["attendance", today, selectedService],
        queryFn: () => base44.entities.Attendance.filter({
            service_date: today,
            service_type: selectedService
        }),
    });

    const createAttendanceMutation = useMutation({
        mutationFn: (data) => base44.entities.Attendance.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            refetchAttendance();
        },
    });

    const updateVisitorMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Visitor.update(id, data),
    });

    const handleSearch = async (query) => {
        setIsSearching(true);
        setSearchResults(null);
        setCheckInSuccess(false);
        setCheckInError(null);

        const queryLower = query.toLowerCase();

        // Search in members
        const matchingMembers = members.filter(m => 
            m.member_id?.toLowerCase().includes(queryLower) ||
            m.first_name?.toLowerCase().includes(queryLower) ||
            m.last_name?.toLowerCase().includes(queryLower) ||
            `${m.first_name} ${m.last_name}`.toLowerCase().includes(queryLower)
        ).map(m => ({ ...m, type: 'member' }));

        // Search in visitors
        const matchingVisitors = visitors.filter(v => 
            v.visitor_id?.toLowerCase().includes(queryLower) ||
            v.first_name?.toLowerCase().includes(queryLower) ||
            v.last_name?.toLowerCase().includes(queryLower) ||
            `${v.first_name} ${v.last_name}`.toLowerCase().includes(queryLower)
        ).map(v => ({ ...v, type: 'visitor' }));

        setSearchResults([...matchingMembers, ...matchingVisitors]);
        setIsSearching(false);
    };

    const handleCheckIn = async (person) => {
        setCheckInSuccess(false);
        setCheckInError(null);

        // Check if already checked in
        const personId = person.type === 'member' ? person.member_id : person.visitor_id;
        const alreadyCheckedIn = todayAttendance.some(a => 
            a.person_id === personId && 
            a.service_type === selectedService
        );

        if (alreadyCheckedIn) {
            setCheckInError(`${person.first_name} ${person.last_name} is already checked in for this service.`);
            return;
        }

        const attendanceData = {
            person_id: personId,
            person_type: person.type,
            person_name: `${person.first_name} ${person.last_name}`,
            service_date: today,
            service_type: selectedService,
            check_in_time: format(new Date(), "hh:mm a"),
        };

        await createAttendanceMutation.mutateAsync(attendanceData);

        // Update visitor visit count
        if (person.type === 'visitor') {
            await updateVisitorMutation.mutateAsync({
                id: person.id,
                data: { visit_count: (person.visit_count || 1) + 1 }
            });
        }

        setCheckInSuccess(true);
        setSearchResults(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setCheckInSuccess(false), 3000);
    };

    const memberCount = todayAttendance.filter(a => a.person_type === 'member').length;
    const visitorCount = todayAttendance.filter(a => a.person_type === 'visitor').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-amber-50/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg mb-4">
                        <ClipboardCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Check-In Station</h1>
                    <p className="text-slate-500">
                        {format(new Date(), "EEEE, MMMM d, yyyy")}
                    </p>
                </div>

                {/* Service Selection */}
                <Card className="border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="h-5 w-5" />
                                <span className="font-medium">Service Type:</span>
                            </div>
                            <Select value={selectedService} onValueChange={setSelectedService}>
                                <SelectTrigger className="w-full sm:w-[250px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-slate-100 p-4 text-center"
                    >
                        <Users className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-slate-800">{todayAttendance.length}</p>
                        <p className="text-sm text-slate-500">Total</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl border border-slate-100 p-4 text-center"
                    >
                        <UserCheck className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-slate-800">{memberCount}</p>
                        <p className="text-sm text-slate-500">Members</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl border border-slate-100 p-4 text-center"
                    >
                        <UserPlus className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-slate-800">{visitorCount}</p>
                        <p className="text-sm text-slate-500">Visitors</p>
                    </motion.div>
                </div>

                {/* Search & Check-In */}
                <Card className="border-slate-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Check-In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CheckInSearch
                            onSearch={handleSearch}
                            searchResults={searchResults}
                            isSearching={isSearching}
                            onCheckIn={handleCheckIn}
                            isCheckingIn={createAttendanceMutation.isPending}
                            checkInSuccess={checkInSuccess}
                            checkInError={checkInError}
                        />
                    </CardContent>
                </Card>

                {/* Today's Check-ins */}
                <Card className="border-slate-100">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-slate-400" />
                            Today's Check-ins
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todayAttendance.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                <p>No check-ins yet for this service</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {todayAttendance.map((record, index) => (
                                    <div 
                                        key={record.id || index}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                                                record.person_type === 'member'
                                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                                    : 'bg-gradient-to-br from-amber-400 to-amber-500'
                                            }`}>
                                                {record.person_name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">{record.person_name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{record.person_id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`text-xs ${
                                                record.person_type === 'member'
                                                    ? 'border-purple-200 text-purple-600'
                                                    : 'border-amber-200 text-amber-600'
                                            }`}>
                                                {record.person_type}
                                            </Badge>
                                            <span className="text-sm text-slate-400">
                                                {record.check_in_time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}