import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RobotMessageProps {
  type: "success" | "warning" | "danger";
  message: string;
  className?: string;
}

export function RobotMessage({ type, message, className }: RobotMessageProps) {
  const glows = {
    success: "shadow-[0_0_20px_rgba(76,223,242,0.5)]",
    warning: "shadow-[0_0_20px_rgba(240,168,32,0.5)]",
    danger: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-[#071A2F]/80 backdrop-blur-md",
        glows[type],
        className
      )}
    >
      <div className="text-2xl">🤖</div>
      <p className="text-white font-medium text-sm">{message}</p>
    </motion.div>
  );
}
