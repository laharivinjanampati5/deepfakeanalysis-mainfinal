import { useState } from "react";
import { Copy, FileCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const HumanReviewRequest = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comments, setComments] = useState("");
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsOpen(false);
        setComments("");

        toast({
            title: "Review Requested",
            description: "A certified analyst will review this case shortly. Case ID: #HR-8829",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="glass-card p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-white/5 transition-colors group">
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <FileCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Request Human Review</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Unsure about the result? Get expert verification.
                    </p>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
                <DialogHeader>
                    <DialogTitle>Request Expert Review</DialogTitle>
                    <DialogDescription>
                        Flag this media for analysis by our certified investigative team.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="comments">Why do you suspect this is fake/real?</Label>
                        <Textarea
                            id="comments"
                            placeholder="E.g., The shadows look wrong, audio sync is off..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="bg-black/20 border-white/10"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                        <Copy className="w-4 h-4" />
                        <span>Case ID generated: #HR-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Request"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
