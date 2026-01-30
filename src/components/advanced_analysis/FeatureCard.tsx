import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";

interface FeatureCardProps {
    title: string;
    icon: React.ElementType;
    description: string;
    isSuspicious?: boolean;
    score?: number;
    children?: React.ReactNode;
}

export const FeatureCard = ({
    title,
    icon: Icon,
    description,
    isSuspicious = false,
    score,
    children
}: FeatureCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`glass-card border-l-4 ${isSuspicious ? 'border-l-destructive' : 'border-l-success'} overflow-hidden`}>
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isSuspicious ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {title}
                            {score !== undefined && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isSuspicious ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                                    {score}%
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isSuspicious ? (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                    ) : (
                        <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    <button className="text-muted-foreground hover:text-foreground">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-muted/50"
                    >
                        <div className="p-4 bg-muted/10">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
