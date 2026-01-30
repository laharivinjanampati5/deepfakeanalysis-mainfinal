import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineExplorerProps {
    temporalScore: number;
}

export const TimelineExplorer = ({ temporalScore }: TimelineExplorerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const constraintsRef = useRef(null);

    // Mock data generation based on temporal score
    // In a real app, this would come from the analysis backend
    const generateRiskPoints = () => {
        return Array.from({ length: 20 }, (_, i) => ({
            time: i * 5,
            risk: Math.random() * temporalScore, // Correlate with actual score
        }));
    };

    const riskPoints = generateRiskPoints();

    return (
        <div className="glass-card p-6 md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Explainable AI Timeline</h3>
                <span className="text-xs text-muted-foreground">Mock Data Preview</span>
            </div>

            <div className="relative h-24 bg-black/20 rounded-md overflow-hidden flex items-end px-2 pt-4 pb-2" ref={constraintsRef}>
                {/* Risk Bars */}
                {riskPoints.map((point, i) => (
                    <div
                        key={i}
                        className="flex-1 mx-0.5 rounded-t-sm transition-all duration-300 hover:bg-red-400"
                        style={{
                            height: `${point.risk * 100}%`,
                            backgroundColor: point.risk > 0.6 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.3)'
                        }}
                    />
                ))}

                {/* Scrubber */}
                <motion.div
                    drag="x"
                    dragConstraints={constraintsRef}
                    dragElastic={0}
                    dragMomentum={false}
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex flex-col items-center"
                    style={{ x: currentTime }}
                    onDrag={(event, info) => {
                        // Update current time logic would go here
                        // For prototype, we just let it slide
                    }}
                >
                    <div className="w-4 h-4 rounded-full bg-white shadow-lg mt-[-8px]" />
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full w-10 h-10"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                </Button>

                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span>Spike detected at 00:04 - Inconsistent lighting shadows</span>
                </div>
            </div>
        </div>
    );
};
