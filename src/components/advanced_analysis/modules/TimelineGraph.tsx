import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

const mockFrames = Array.from({ length: 30 }, (_, i) => ({
    frame: i,
    probability: Math.random() * 100,
    scene: i < 10 ? 'Scene 1' : i < 20 ? 'Scene 2' : 'Scene 3'
}));

export const TimelineGraph = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Frame-by-Frame Fake Probability</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">30 Frames Analyzed</span>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockFrames}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.1)" vertical={false} />
                        <XAxis dataKey="frame" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                        />
                        <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Bar
                            dataKey="probability"
                            fill="hsl(var(--primary))"
                            radius={[2, 2, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-muted/20 rounded">Scene 1 (Safe)</div>
                <div className="p-2 bg-destructive/10 text-destructive rounded border border-destructive/20">Scene 2 (Anomaly)</div>
                <div className="p-2 bg-muted/20 rounded">Scene 3 (Safe)</div>
            </div>
        </div>
    );
};
