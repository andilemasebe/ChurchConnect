import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Send, Loader2 } from "lucide-react";

export default function ReplyDialog({ message, open, onClose, onSend, isLoading }) {
    const [replyContent, setReplyContent] = useState("");

    const handleSend = () => {
        if (replyContent.trim()) {
            onSend(message.id, replyContent);
            setReplyContent("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Reply to Message</DialogTitle>
                    <DialogDescription>
                        Replying to: {message?.subject}
                    </DialogDescription>
                </DialogHeader>

                {/* Original Message */}
                <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="text-sm space-y-2">
                            <div>
                                <span className="font-medium text-slate-700">From:</span>{" "}
                                <span className="text-slate-600">{message?.sender_name} ({message?.sender_email})</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Subject:</span>{" "}
                                <span className="text-slate-600">{message?.subject}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                                <p className="text-slate-600 whitespace-pre-wrap">{message?.content}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reply Input */}
                    <div className="space-y-2">
                        <Label htmlFor="reply">Your Reply</Label>
                        <Textarea
                            id="reply"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Type your reply here..."
                            rows={6}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSend}
                        disabled={isLoading || !replyContent.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Send className="h-4 w-4 mr-2" />
                        )}
                        Send Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}