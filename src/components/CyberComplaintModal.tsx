import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, Upload, CheckCircle, Download, AlertTriangle, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
    score: number;
    verdict: "authentic" | "deepfake" | "suspicious";
    details: string[];
}

export const CyberComplaintModal = () => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"upload" | "analyzing" | "review" | "success">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startAnalysis = () => {
        if (!file) return;
        setStep("analyzing");
        setProgress(0);

        // Mock Analysis
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishAnalysis();
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const finishAnalysis = () => {
        // Mock Result - simulating a Deepfake detection
        setResult({
            score: 94.5,
            verdict: "deepfake",
            details: [
                "Inconsistent lighting on face",
                "Irregular blinking pattern detected (Video forensic)",
                "Audio-visual sync mismatch (Lip-sync error)",
                "Metadata tampering detected"
            ]
        });
        setStep("review");
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();

        // Header
        doc.setFillColor(220, 53, 69); // Red header
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255);
        doc.setFontSize(16);
        doc.text("CYBER CRIME COMPLAINT REPORT", 105, 13, { align: "center" });

        // Reset Text
        doc.setTextColor(0);
        doc.setFontSize(12);

        // Meta Info
        doc.autoTable({
            startY: 30,
            head: [['Report Information', '']],
            body: [
                ['Date & Time', date],
                ['Reference ID', `CYBER-${Math.floor(Math.random() * 100000)}`],
                ['Status', 'PROVISIONAL - AI GENERATED'],
            ],
            theme: 'plain',
            styles: { fontSize: 10 }
        } as any);

        // Incident Details
        doc.setFontSize(14);
        doc.text("1. Incident Details", 14, 70);
        doc.setFontSize(11);
        doc.text(`Offense Type: Suspected Deepfake / Digital Impersonation`, 14, 80);
        const descLines = doc.splitTextToSize(`Description: ${description || "No specific description provided by the user."}`, 180);
        doc.text(descLines, 14, 90);

        // Forensic Findings
        if (result) {
            let yPos = 110;
            doc.setFontSize(14);
            doc.text("2. Forensic Analysis Findings", 14, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(220, 0, 0);
            doc.text(`Verdict: ${result.verdict.toUpperCase()}`, 14, yPos);
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");

            yPos += 7;
            doc.text(`Authenticity Score: ${(100 - result.score).toFixed(1)}%`, 14, yPos);
            yPos += 7;
            doc.text(`Manipulation Probability: ${result.score}%`, 14, yPos);

            yPos += 10;
            doc.text("Detected Anomalies / Evidence:", 14, yPos);
            result.details.forEach((detail) => {
                yPos += 7;
                doc.text(`- ${detail}`, 18, yPos);
            });
        }

        // Recommendations
        doc.setFontSize(14);
        doc.text("3. Suggested Actions", 14, 170);
        doc.setFontSize(11);
        doc.text("- The content has been flagged as high-risk media.", 14, 180);
        doc.text("- Immediate preservation of digital artifacts is recommended.", 14, 187);
        doc.text("- This report serves as preliminary digital evidence.", 14, 194);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("This report was automatically generated by DeepfakeAI Assistant.", 105, 280, { align: "center" });
        doc.text("For official law enforcement use, forensic verification is required.", 105, 285, { align: "center" });

        doc.save("Cyber_Complaint_Report.pdf");
    };

    const handleSubmit = () => {
        // Mock Submission
        toast({
            title: "Complaint Submitted",
            description: "Your report has been securely sent to the Cyber Cell.",
        });
        setStep("success");
    };

    const reset = () => {
        setStep("upload");
        setFile(null);
        setDescription("");
        setResult(null);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 border-red-500/50 bg-red-600 hover:bg-red-700 text-white font-semibold">
                    <ShieldAlert className="w-4 h-4" />
                    Report to Cyber Cell
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        AI Cyber Complaint Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Report suspected deepfakes instantly. Our AI will analyze the evidence and generate a formal cybercrime report.
                    </DialogDescription>
                </DialogHeader>

                {step === "upload" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Upload Evidence (Image/Video)</Label>
                            <div
                                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer border-muted-foreground/25"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-center text-muted-foreground">
                                    {file ? (
                                        <span className="text-primary font-medium">{file.name}</span>
                                    ) : (
                                        <>Click to select file or drag & drop<br />(Images/Videos)</>
                                    )}
                                </span>
                                <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Incident Description (Optional)</Label>
                            <Textarea id="desc" placeholder="Briefly describe where you found this, who sent it, etc..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <Button onClick={startAnalysis} disabled={!file} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-0">
                            Scan & Generate Report
                        </Button>
                    </div>
                )}

                {step === "analyzing" && (
                    <div className="py-8 space-y-6 text-center">
                        <div className="space-y-2">
                            <img src="https://media.tenor.com/On7kvXhzml4AAAAC/loading-gif.gif" alt="Scanning" className="w-16 h-16 mx-auto opacity-50 hidden" />
                            {/* Using pure CSS loader or Lucide instead of external image to be safe */}
                            <div className="flex justify-center mb-4">
                                <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground">Analyzing Evidence...</h3>
                            <p className="text-sm text-muted-foreground">Checking for biological markers, metadata tampering, and compression artifacts.</p>
                        </div>
                        <div className="space-y-1">
                            <Progress value={progress} className="w-full h-2" />
                            <p className="text-xs text-right text-muted-foreground">{progress}%</p>
                        </div>
                    </div>
                )}

                {step === "review" && result && (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${result.verdict === 'deepfake' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                            <div className="flex items-center gap-2 font-bold mb-2 text-lg">
                                <AlertTriangle className="w-5 h-5" />
                                Detection Result: {result.verdict.toUpperCase()}
                            </div>
                            <p className="text-sm text-foreground/80">
                                Confidence Score: <span className="font-mono font-bold">{result.score}%</span>
                            </p>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-md space-y-2">
                            <h4 className="font-medium flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4" /> Evidence Found:
                            </h4>
                            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                                {result.details.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" onClick={generatePDF} className="gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </Button>
                            <Button onClick={handleSubmit} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                                <ShieldAlert className="w-4 h-4" />
                                Submit to Cyber Cell
                            </Button>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="text-center py-6 space-y-4">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Report Filed Successfully</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Your complaint has been registered with the Cyber Crime Portal.
                            </p>
                            <div className="bg-muted p-2 rounded text-xs font-mono mt-2 inline-block">
                                REF: #CYB-{Math.floor(Math.random() * 10000)}
                            </div>
                        </div>
                        <Button onClick={reset} variant="outline" className="mt-4">Close Window</Button>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
};
