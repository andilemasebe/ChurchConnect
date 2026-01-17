import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddMembersDialog({ ministry, open, onClose, onSubmit, existingMembers, isLoading }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("member");

    const { data: allMembers = [] } = useQuery({
        queryKey: ["members"],
        queryFn: () => base44.entities.Member.list(),
        enabled: open,
    });

    const availableMembers = allMembers.filter(member => 
        !existingMembers?.some(em => em.member_id === member.member_id)
    );

    const filteredMembers = availableMembers.filter(member =>
        member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.member_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleMember = (member) => {
        setSelectedMembers(prev => {
            const exists = prev.find(m => m.member_id === member.member_id);
            if (exists) {
                return prev.filter(m => m.member_id !== member.member_id);
            } else {
                return [...prev, member];
            }
        });
    };

    const handleSubmit = () => {
        const membersToAdd = selectedMembers.map(member => ({
            ministry_id: ministry.id,
            ministry_name: ministry.name,
            member_id: member.member_id,
            member_name: `${member.first_name} ${member.last_name}`,
            member_email: member.email,
            role: selectedRole,
            joined_date: new Date().toISOString().split("T")[0],
        }));
        onSubmit(membersToAdd);
        setSelectedMembers([]);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Members to {ministry?.name}</DialogTitle>
                    <DialogDescription>
                        Select members to add to this ministry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="assistant_leader">Assistant Leader</SelectItem>
                                <SelectItem value="leader">Leader</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ScrollArea className="h-[300px] border rounded-lg">
                        <div className="p-4 space-y-2">
                            {filteredMembers.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">
                                    {searchQuery ? "No members found" : "All members are already in this ministry"}
                                </p>
                            ) : (
                                filteredMembers.map((member) => (
                                    <div
                                        key={member.member_id}
                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer"
                                        onClick={() => handleToggleMember(member)}
                                    >
                                        <Checkbox
                                            checked={selectedMembers.some(m => m.member_id === member.member_id)}
                                            onCheckedChange={() => handleToggleMember(member)}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">
                                                {member.first_name} {member.last_name}
                                            </p>
                                            <p className="text-sm text-slate-500">{member.member_id}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    {selectedMembers.length > 0 && (
                        <p className="text-sm text-slate-600">
                            {selectedMembers.length} member(s) selected
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isLoading || selectedMembers.length === 0}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        Add {selectedMembers.length} Member(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}