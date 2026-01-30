import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TrustScoreMeter } from "./TrustScoreMeter";
import { HumanReviewRequest } from "./HumanReviewRequest";
import { TimelineExplorer } from "./TimelineExplorer";
import { SafetyContribution } from "./SafetyContribution";
import { ActionGuidance } from "./ActionGuidance";
import { EmploymentHub } from "./EmploymentHub";

// Duplicate interface to avoid refactoring DetectionSection.tsx
interface AnalysisResult {
    isDeepfake: boolean;
    confidence: number;
    spatialScore: number;
    temporalScore: number;
    biologicalScore: number;
    frequencyScore: number;
    analysis?: string;
    detectedArtifacts?: string[];
}

interface EnhancementLayerProps {
    result: AnalysisResult;
}

export const EnhancementLayer = ({ result }: EnhancementLayerProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section className="mt-8 border-t border-white/10 pt-8" id="human-centric-layer">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gradient">
                        Human-Centric Insights & Verify
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Advanced verification, community safety, and expert review.
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Row 1: Immediate Insights */}
                    <TrustScoreMeter
                        confidence={result.confidence}
                        isDeepfake={result.isDeepfake}
                    />

                    <ActionGuidance
                        isDeepfake={result.isDeepfake}
                        confidence={result.confidence}
                    />

                    <SafetyContribution />

                    {/* Row 2: Deep Dive */}
                    <TimelineExplorer temporalScore={result.temporalScore} />

                    <div className="flex flex-col gap-6">
                        <HumanReviewRequest />
                        <EmploymentHub />
                    </div>

                </motion.div>
            )}
        </section>
    );
};
