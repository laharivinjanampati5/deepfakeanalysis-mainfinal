
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Upload, Download, Lock, File as FileIcon, X, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { immunizeImage } from "@/utils/imageProcessing";
import { useToast } from "@/components/ui/use-toast";

const Immunization = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [immunizedBlob, setImmunizedBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload an image file.",
                    variant: "destructive"
                });
                return;
            }
            setSelectedFile(file);
            setIsComplete(false);
            setImmunizedBlob(null);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setIsComplete(false);
        setImmunizedBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleAction = async () => {
        if (isComplete && immunizedBlob && selectedFile) {
            // Download Logic
            const url = URL.createObjectURL(immunizedBlob);
            const a = document.createElement('a');
            a.href = url;
            // Append _immunized before the extension
            const nameParts = selectedFile.name.split('.');
            const ext = nameParts.pop();
            const name = nameParts.join('.');
            a.download = `${name}_immunized.${ext}`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Download Started",
                description: "Your immunized image is being downloaded."
            });
            return;
        }

        if (!selectedFile) {
            fileInputRef.current?.click();
        } else {
            // Start Immunization
            setIsProcessing(true);
            try {
                const resultBlob = await immunizeImage(selectedFile);
                setImmunizedBlob(resultBlob);
                setIsComplete(true);
                toast({
                    title: "Immunization Complete",
                    description: "Your image has been protected with adversarial noise."
                });
            } catch (error) {
                toast({
                    title: "Processing Failed",
                    description: "Could not immunize the image. Please try again.",
                    variant: "destructive"
                });
                console.error(error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-6 py-32">

                <div className="mb-8">
                    <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-purple text-sm text-secondary border border-secondary/20 mb-6">
                        <Lock className="w-4 h-4" />
                        AI Defense Module
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Image <span className="text-gradient">Immunization</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Apply invisible protection layers to your photos. Our tool adds subtle feature-space perturbations
                        that disrupt AI face recognition and deepfake algorithms without affecting visual quality.
                    </p>
                </motion.div>

                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card-purple p-8 rounded-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10 border-2 border-dashed border-secondary/30 rounded-xl p-12 text-center transition-all hover:border-secondary/50 hover:bg-secondary/5">

                            {selectedFile ? (
                                <div className="flex flex-col items-center mb-6 relative">
                                    <div className="relative">
                                        <FileIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                                        {isComplete && (
                                            <div className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-1 border-2 border-background">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-foreground font-medium text-lg truncate max-w-[250px]">{selectedFile.name}</span>
                                    <span className="text-sm text-muted-foreground mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>

                                    {!isProcessing && !isComplete && (
                                        <Button variant="ghost" size="icon" onClick={clearFile} className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive" title="Remove file">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                                    <Upload className="w-16 h-16 text-secondary mx-auto mb-6" />
                                    <h4 className="text-xl font-semibold text-foreground mb-2">
                                        Drop your image here
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Supports PNG, JPG, JPEG
                                    </p>
                                    <Button variant="outline" className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Browse Files
                                    </Button>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                            />

                            {selectedFile && (
                                <Button
                                    onClick={handleAction}
                                    disabled={isProcessing}
                                    size="lg"
                                    className="w-full md:w-auto min-w-[200px] bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple"
                                >
                                    {isProcessing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Shield className="w-4 h-4 mr-2" />
                                            </motion.div>
                                            Applying Protection...
                                        </>
                                    ) : isComplete ? (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Protected Image
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4 mr-2" />
                                            Immunize Image
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 space-y-3"
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Injecting frequency perturbations & warping geometry...</span>
                                    <span className="text-secondary font-mono animate-pulse">Deep-Processing</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                        {isComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-4"
                            >
                                <div className="p-2 bg-success/20 rounded-full">
                                    <Shield className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-success mb-1">Protection Applied</h5>
                                    <p className="text-sm text-foreground/80">
                                        Your image now contains invisible data perturbations that make it difficult for AI models to recognize or reuse the face. The visual quality remains 99% identical to the original.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-medium text-foreground">Deepfake Resistant</h3>
                            <p className="text-xs text-muted-foreground">Prevents generation based on your face data.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-secondary" />
                            </div>
                            <h3 className="font-medium text-foreground">Scraping Defense</h3>
                            <p className="text-xs text-muted-foreground">Blocks automated scrapers from indexing identity.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="font-medium text-foreground">Non-Destructive</h3>
                            <p className="text-xs text-muted-foreground">Maintains image quality for human viewing.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Immunization;
