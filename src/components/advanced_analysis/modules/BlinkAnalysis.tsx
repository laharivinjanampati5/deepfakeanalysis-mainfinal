import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    blink: Math.random() * 100,
    expected: 40 + Math.random() * 20
}));

export const BlinkAnalysis = ({ isFake }: { isFake: boolean }) => {
    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
                Analysis of eye aspect ratio (EAR) over time to detect natural blinking patterns.
                {isFake ? (
                    <span className="text-destructive font-semibold ml-1">Irregular blinking detected.</span>
                ) : (
                    <span className="text-success font-semibold ml-1">Normal blinking frequency observed.</span>
                )}
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="blink"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary)/0.2)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="expected"
                            stroke="hsl(var(--muted-foreground))"
                            fill="transparent"
                            strokeDasharray="4 4"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
                <span>00:00</span>
                <span>Timeline (Seconds)</span>
                <span>00:20</span>
            </div>
        </div>
    );
};
