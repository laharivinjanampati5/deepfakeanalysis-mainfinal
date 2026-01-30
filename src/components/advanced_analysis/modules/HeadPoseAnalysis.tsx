import { motion } from "framer-motion";

export const HeadPoseAnalysis = ({ isFake }: { isFake: boolean }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center border border-muted">
                    <div className="text-xs text-muted-foreground mb-1">Yaw Consistency</div>
                    <div className={`text-lg font-bold ${isFake ? 'text-destructive' : 'text-success'}`}>
                        {isFake ? 'Low (Variance > 15°)' : 'High (Variance < 2°)'}
                    </div>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center border border-muted">
                    <div className="text-xs text-muted-foreground mb-1">Pitch Stability</div>
                    <div className="text-lg font-bold text-foreground">
                        Normal
                    </div>
                </div>
            </div>

            <div className="relative h-24 bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Mock 3D visualization placeholder */}
                <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-20">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="bg-primary/20 rounded-sm"></div>
                    ))}
                </div>

                <div className="relative z-10 flex gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2 opacity-70"></div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Model 1</span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-secondary border-b-transparent animate-spin mx-auto mb-2 opacity-70" style={{ animationDirection: 'reverse' }}></div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Model 2</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Detecting discrepancies between 2D landmarks and 3D head geometry re-projection.
            </p>
        </div>
    );
};
