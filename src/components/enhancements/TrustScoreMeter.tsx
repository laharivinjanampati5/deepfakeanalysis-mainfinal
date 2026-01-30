import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface TrustScoreProps {
    confidence: number;
    isDeepfake: boolean;
}

export const TrustScoreMeter = ({ confidence, isDeepfake }: TrustScoreProps) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Calculate trust score:
        // If real (not deepfake): Score is high (e.g. 50 + confidence * 50)
        // If fake: Score is low (e.g. 50 - confidence * 50)
        // This is a simplified mock logic for the prototype
        const targetScore = isDeepfake
            ? Math.max(0, 100 - confidence * 100) // High confidence fake = Low trust
            : Math.min(100, 50 + confidence * 50); // High confidence real = High trust

        setScore(Math.round(targetScore));
    }, [confidence, isDeepfake]);

    const getColor = (s: number) => {
        if (s >= 80) return "text-green-500";
        if (s >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getIcon = (s: number) => {
        if (s >= 80) return <ShieldCheck className="w-8 h-8 text-green-500" />;
        if (s >= 50) return <Shield className="w-8 h-8 text-yellow-500" />;
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
    };

    return (
        <div className="glass-card p-6 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Dynamic Trust Score</h3>

            <div className="relative flex items-center justify-center">
                {/* Arc Background */}
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: score / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className={getColor(score)}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    {getIcon(score)}
                    <span className={`text-2xl font-bold ${getColor(score)}`}>{score}</span>
                </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
                Based on AI confidence, historical patterns, and community feedback.
            </p>
        </div>
    );
};
