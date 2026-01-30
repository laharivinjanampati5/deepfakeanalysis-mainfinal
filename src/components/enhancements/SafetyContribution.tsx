import { useState } from "react";
import { HandHeart, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export const SafetyContribution = () => {
    const [contributed, setContributed] = useState(false);
    const { toast } = useToast();

    const handleContribute = () => {
        setContributed(true);
        toast({
            title: "Contribution Recorded!",
            description: "+50 Reputation Points earned. Thank you for making the internet safer.",
        });
    };

    return (
        <div className="glass-card p-6 flex flex-col space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-24 h-24" />
            </div>

            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-pink-500" />
                Community Safety
            </h3>

            {!contributed ? (
                <>
                    <p className="text-sm text-muted-foreground">
                        Opt-in to share anonymized analysis data to help train our open-source models.
                    </p>
                    <div className="mt-auto pt-4">
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition-opacity" onClick={handleContribute}>
                            Contribute & Earn Badges
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-full justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 mb-2">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-xl">Guardian Lvl 1</h4>
                        <p className="text-xs text-muted-foreground">You are a top contributor!</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Next Badge</span>
                            <span>350 / 500 XP</span>
                        </div>
                        <Progress value={70} className="h-2" />
                    </div>
                </div>
            )}
        </div>
    );
};
