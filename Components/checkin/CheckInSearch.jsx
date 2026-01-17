import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserCheck, UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckInSearch({ 
    onSearch, 
    searchResults, 
    isSearching, 
    onCheckIn,
    isCheckingIn,
    checkInSuccess,
    checkInError 
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Enter Member ID or Visitor ID (e.g., MEM-ABC123)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-purple-500 rounded-xl"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="h-14 px-8 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg"
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Search"
                        )}
                    </Button>
                </div>
            </form>

            {/* Status Messages */}
            <AnimatePresence>
                {checkInSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                    >
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <span className="text-emerald-800 font-medium">Check-in successful!</span>
                    </motion.div>
                )}
                {checkInError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <span className="text-red-800 font-medium">{checkInError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Results */}
            <AnimatePresence>
                {searchResults && searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Search Results
                        </h3>
                        {searchResults.map((person) => (
                            <Card 
                                key={person.id} 
                                className="overflow-hidden border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-semibold ${
                                                person.type === 'member' 
                                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                                                    : 'bg-gradient-to-br from-amber-400 to-amber-500'
                                            }`}>
                                                {person.first_name?.[0]}{person.last_name?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">
                                                    {person.first_name} {person.last_name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-slate-400">
                                                        {person.type === 'member' ? person.member_id : person.visitor_id}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        person.type === 'member'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {person.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => onCheckIn(person)}
                                            disabled={isCheckingIn}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                                        >
                                            {isCheckingIn ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {person.type === 'member' ? (
                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                    ) : (
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                    )}
                                                    Check In
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                )}
                {searchResults && searchResults.length === 0 && !isSearching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700">No results found</h3>
                        <p className="text-slate-500 mt-1">
                            Try searching with a different ID or name
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}