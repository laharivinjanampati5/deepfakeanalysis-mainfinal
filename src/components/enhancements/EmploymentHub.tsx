import { useState } from "react";
import { Briefcase, CheckCircle2, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface EmploymentHubProps {
    variant?: "card" | "button";
}

export const EmploymentHub = ({ variant = "card" }: EmploymentHubProps) => {
    const [balance, setBalance] = useState(48.50);

    const pendingCases = [
        { id: "HR-9921", type: "Video", reward: 2.50, difficulty: "Medium" },
        { id: "HR-9925", type: "Audio", reward: 1.20, difficulty: "Easy" },
        { id: "HR-9930", type: "Image", reward: 0.80, difficulty: "Hard" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {variant === "card" ? (
                    <div className="col-span-full mt-4 p-4 rounded-lg border border-dashed border-white/20 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Employment Dashboard</h4>
                                <p className="text-sm text-muted-foreground">Review cases and earn income</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-bold text-green-400">${balance.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">Pending Payout</span>
                        </div>
                    </div>
                ) : (
                    <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10">
                        <Briefcase className="w-4 h-4" />
                        Analyst Dashboard
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] border-l border-white/10 glass-card">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Cyber Analyst Workspace
                    </SheetTitle>
                    <SheetDescription>
                        Review potentially manipulated media and help secure the digital space.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs">Accuracy Score</span>
                            </div>
                            <span className="text-2xl font-bold">94%</span>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Wallet className="w-4 h-4" />
                                <span className="text-xs">Total Earnings</span>
                            </div>
                            <span className="text-2xl font-bold text-green-400">$342.50</span>
                        </div>
                    </div>

                    {/* Task List */}
                    <div>
                        <h4 className="text-sm font-medium mb-3">Available Tasks</h4>
                        <ScrollArea className="h-[300px] rounded-md border border-white/10 p-4">
                            <div className="space-y-3">
                                {pendingCases.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{task.type}</span>
                                            </div>
                                            <div className="text-xs mt-1 text-muted-foreground">Difficulty: {task.difficulty}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-green-400 flex items-center">
                                                <DollarSign className="w-3 h-3" />
                                                {task.reward.toFixed(2)}
                                            </span>
                                            <Button size="sm" variant="secondary">Start</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
