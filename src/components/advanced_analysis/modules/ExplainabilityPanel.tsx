import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Map, AlertTriangle } from "lucide-react";

export const ExplainabilityPanel = () => {
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-secondary" />
                    <Label htmlFor="heatmap-mode" className="text-sm font-medium">Overlay Manipulation Heatmap</Label>
                </div>
                <Switch id="heatmap-mode" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
            </div>

            {showHeatmap ? (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/30 to-transparent animate-pulse" />
                    <div className="text-center z-10 p-4">
                        <Eye className="w-8 h-8 mx-auto text-white/80 mb-2" />
                        <p className="text-white/80 text-sm">Heatmap Active: High attention on facial boundary regions.</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-muted/10 rounded-lg text-sm text-muted-foreground border border-muted/50">
                    <div className="flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <p>
                            Why this result? The model detected <strong>inconsistent lighting artifacts</strong> around the jawline and <strong>frequency anomalies</strong> in the high-band spectrum often left by GAN upsampling.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
