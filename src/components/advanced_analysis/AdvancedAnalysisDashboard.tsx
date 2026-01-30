import { motion } from "framer-motion";
import { Eye, Activity, Rotate3D, Layers, FileText, BrainCircuit } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { BlinkAnalysis } from "./modules/BlinkAnalysis";
import { HeadPoseAnalysis } from "./modules/HeadPoseAnalysis";
import { TimelineGraph } from "./modules/TimelineGraph";
import { ExplainabilityPanel } from "./modules/ExplainabilityPanel";
import { EvidencePack } from "./modules/EvidencePack";

interface AdvancedAnalysisDashboardProps {
    result: {
        isDeepfake: boolean;
        confidence: number;
        analysis?: string;
    };
}

export const AdvancedAnalysisDashboard = ({ result }: AdvancedAnalysisDashboardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 mt-12"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                    Advanced Forensic Analysis
                </h2>
                <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full border border-muted/30">
                    Pro Modules Active
                </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Module 1: Blink & Micro-Expressions */}
                <FeatureCard
                    title="Blink & Micro-Expressions"
                    icon={Eye}
                    description="Analyzes EAR (Eye Aspect Ratio) and involuntary micro-twitches."
                    isSuspicious={result.isDeepfake}
                    score={result.isDeepfake ? 15 : 98}
                >
                    <BlinkAnalysis isFake={result.isDeepfake} />
                </FeatureCard>

                {/* Module 2: Head Pose Consistency */}
                <FeatureCard
                    title="Head Pose Consistency"
                    icon={Rotate3D}
                    description="Verifies if 2D facial landmarks align with estimated 3D geometry."
                    isSuspicious={result.isDeepfake}
                    score={result.isDeepfake ? 42 : 95}
                >
                    <HeadPoseAnalysis isFake={result.isDeepfake} />
                </FeatureCard>

                {/* Module 3: Deepfake Timeline */}
                <FeatureCard
                    title="Fake Probability Timeline"
                    icon={Activity}
                    description="Frame-by-frame analysis to detect specific manipulated segments."
                    isSuspicious={result.isDeepfake}
                >
                    <TimelineGraph />
                </FeatureCard>

                {/* Module 4: Explainability */}
                <div className="md:col-span-2 lg:col-span-2">
                    <FeatureCard
                        title="Explainability & Heatmaps"
                        icon={Layers}
                        description="Visualize exactly where the AI detected manipulation artifacts."
                        isSuspicious={result.isDeepfake}
                    >
                        <ExplainabilityPanel />
                    </FeatureCard>
                </div>

                {/* Module 5: Evidence & Reporting */}
                <FeatureCard
                    title="Forensic Evidence Pack"
                    icon={FileText}
                    description="Generate legally admissible reports and raw analysis logs."
                >
                    <EvidencePack result={result} />
                </FeatureCard>
            </div>
        </motion.div>
    );
};
