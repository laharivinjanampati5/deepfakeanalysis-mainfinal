import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Upload, Sparkles, Download, Lock, Zap, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImmunizeSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsComplete(false); // Reset completion state on new file
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setIsComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAction = () => {
    if (isComplete && selectedFile) {
      // Download Logic
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = `immunized_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    if (!selectedFile) {
      // Trigger File Input
      fileInputRef.current?.click();
    } else {
      // Start Immunization
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 3000);
    }
  };

  return (
    <section id="immunize" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-purple text-sm text-secondary border border-secondary/20 mb-6">
            <Lock className="w-4 h-4" />
            Adversarial Protection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Immunize Your <span className="text-gradient">Identity</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add invisible adversarial noise to your photos that prevents AI systems
            from using them to create deepfakes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card-purple p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">FGSM Protection</h3>
                  <p className="text-muted-foreground">
                    Fast Gradient Sign Method adds imperceptible perturbations that
                    confuse deepfake generation models while remaining invisible to humans.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Proactive Defense</h3>
                  <p className="text-muted-foreground">
                    Instead of just detecting fakes after they're made, prevent your face
                    from being synthesized in the first place.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <Sparkles className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Invisible to Humans</h3>
                  <p className="text-muted-foreground">
                    The adversarial noise is calibrated to be imperceptible to the human eye
                    while remaining highly effective against neural networks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card-purple p-8 text-center">
              <div className="border-2 border-dashed border-secondary/30 rounded-xl p-8 mb-6 bg-secondary/5">
                <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Protect Your Identity?
                </h3>
                <p className="text-muted-foreground mb-8">
                  Launch our advanced Immunization Tool to invisibly protect your images from facial recognition and deepfake algorithms.
                </p>
                <Link to="/immunization">
                  <Button className="w-full md:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple text-lg py-6 px-8">
                    <Shield className="w-5 h-5 mr-3" />
                    Launch Immunization Tool
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                <Lock className="w-3 h-3 inline mr-1" />
                Client-side processing. Your photos never leave your device.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
