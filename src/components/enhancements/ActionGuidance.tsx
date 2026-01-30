import { AlertTriangle, CheckCircle, Info, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionGuidanceProps {
    isDeepfake: boolean;
    confidence: number;
}

export const ActionGuidance = ({ isDeepfake, confidence }: ActionGuidanceProps) => {
    const getGuidance = () => {
        if (isDeepfake && confidence > 0.8) {
            return {
                title: "High Risk: Do Not Share",
                description: "This media shows strong signs of manipulation. Verify with official sources before sharing.",
                icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                borderColor: "border-red-500/50",
                bgColor: "bg-red-500/10",
                actions: ["Report to Platform", "Verify Source"],
            };
        } else if (isDeepfake) {
            return {
                title: "Potential Manipulation",
                description: "Some anomalies detected. Proceed with caution.",
                icon: <Info className="w-6 h-6 text-yellow-500" />,
                borderColor: "border-yellow-500/50",
                bgColor: "bg-yellow-500/10",
                actions: ["Request Review", "Check Metadata"],
            };
        } else {
            return {
                title: "Likely Authentic",
                description: "No significant manipulation detected.",
                icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                borderColor: "border-green-500/50",
                bgColor: "bg-green-500/10",
                actions: ["View Certificate", "Share Safely"],
            };
        }
    };

    const guidance = getGuidance();

    return (
        <div className={`glass-card p-6 flex flex-col justify-between border ${guidance.borderColor} relative overflow-hidden`}>
            <div className={`absolute inset-0 ${guidance.bgColor} opacity-50 pointer-events-none`} />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    {guidance.icon}
                    <h3 className="text-lg font-semibold text-foreground">{guidance.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                    {guidance.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {guidance.actions.map((action, idx) => (
                        <Button key={idx} variant="secondary" size="sm" className="text-xs">
                            {action}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};
