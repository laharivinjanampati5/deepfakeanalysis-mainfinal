import { Button } from "@/components/ui/button";
import { Download, FileText, Package } from "lucide-react";

export const EvidencePack = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-3 justify-start gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-muted-foreground">Summary</div>
                        <div className="text-sm font-semibold">PDF Report</div>
                    </div>
                </Button>

                <Button variant="outline" className="h-auto py-3 justify-start gap-3">
                    <div className="p-2 bg-secondary/10 rounded">
                        <Package className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-muted-foreground">Full Evidence</div>
                        <div className="text-sm font-semibold">Forensic ZIP</div>
                    </div>
                </Button>
            </div>

            <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                <Download className="w-4 h-4" />
                Download Complete Forensic Pack
            </Button>

            <p className="text-xs text-muted-foreground text-center">
                Includes: Original Media, Frame Hashes, Metadata Log, and AI Analysis JSON.
            </p>
        </div>
    );
};
