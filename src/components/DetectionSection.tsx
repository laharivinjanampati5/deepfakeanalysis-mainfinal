import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Cpu, BarChart3 } from "lucide-react";
import { UploadZone } from "./UploadZone";
import { ForensicReport } from "./ForensicReport";
import { useToast } from "@/hooks/use-toast";
import { AdvancedAnalysisDashboard } from "./advanced_analysis/AdvancedAnalysisDashboard";
import { EnhancementLayer } from "./enhancements/EnhancementLayer";
import { EmploymentHub } from "./enhancements/EmploymentHub";
import { analysisService } from "@/services/api";


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

export const DetectionSection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const [loadingText, setLoadingText] = useState("Analyzing...");

  const handleFileSelect = async (file: File) => {
    console.log("Analysis start:", file.name);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setLoadingText("Uploading to Forensic Lab...");

    try {
      const uploadRes = await analysisService.uploadFile(file);
      const analysisId = uploadRes.analysisId;
      if (!analysisId) throw new Error("No analysis ID returned");

      setLoadingText("Authenticating Source...");
      await new Promise(r => setTimeout(r, 800));

      let attempts = 0;
      const poll = async () => {
        try {
          if (attempts >= 40) throw new Error("Analysis timeout");
          const result = await analysisService.getResult(analysisId);
          if (result.status === 'completed') {
            setAnalysisResult({
              isDeepfake: result.isDeepfake,
              confidence: result.confidence,
              spatialScore: result.analysisData?.spatialScore || 0,
              temporalScore: result.analysisData?.temporalScore || 0,
              biologicalScore: result.analysisData?.biologicalScore || 0,
              frequencyScore: result.analysisData?.frequencyScore || 0,
              analysis: result.isDeepfake ? "AI-Generated Media Verified." : "Human/Authentic Sample Verified.",
              detectedArtifacts: result.isDeepfake ? ["AI Trace"] : []
            });
            toast({ title: result.isDeepfake ? "⚠️ Deepfake Detected" : "✓ Authentic", variant: result.isDeepfake ? "destructive" : "default" });
            setIsAnalyzing(false);
          } else if (result.status === 'failed') {
            throw new Error(result.error);
          } else {
            if (attempts === 3) setLoadingText("Scanning Spatial Markers...");
            if (attempts === 8) setLoadingText("Analyzing Biological Pulse...");
            attempts++;
            setTimeout(poll, 1500);
          }
        } catch (err: any) {
          console.error("Poll error:", err);
          setIsAnalyzing(false);
          toast({ title: "Verification Error", description: err.message, variant: "destructive" });
        }
      };
      poll();
    } catch (error: any) {
      console.error("Upload error:", error);
      setIsAnalyzing(false);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <section id="detect" className="py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary border border-primary/20 mb-6">
            <Cpu className="w-4 h-4" />
            AI-Powered Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Forensic <span className="text-gradient">Detection</span> Lab
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload any image or video for comprehensive deepfake analysis.
            Our ensemble AI examines spatial, temporal, and biological markers.
          </p>
        </motion.div>

        {/* Analyst Access */}
        <div className="flex justify-center mb-12">
          <EmploymentHub variant="button" />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Scan,
              title: "Multi-Modal Analysis",
              description: "EfficientNet for spatial analysis, TimeSformer for temporal coherence",
            },
            {
              icon: BarChart3,
              title: "Explainable AI",
              description: "Grad-CAM heatmaps show exactly where manipulation is detected",
            },
            {
              icon: Cpu,
              title: "Biological Detection",
              description: "PPG signal analysis detects missing heartbeat patterns in fakes",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Upload Zone */}
        {!analysisResult && (
          <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} loadingText={loadingText} />
        )}



        {/* Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ForensicReport result={analysisResult} />

            {/* New Advanced Analysis Module */}
            <AdvancedAnalysisDashboard result={analysisResult} />

            {/* Human-Centric Enhancements */}
            <EnhancementLayer result={analysisResult} />

            <div className="text-center mt-12">
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
              >
                Analyze Another File
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
