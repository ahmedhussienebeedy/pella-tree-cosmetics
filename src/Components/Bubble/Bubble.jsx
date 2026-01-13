import { motion } from "framer-motion";

export default function Bubble({ size = 20, color = "#FFD700", x = 0, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${x}%`,
        bottom: "-50px", // تبدأ تحت الشاشة
        opacity: 0.7,
        filter: "blur(8px)", // glow effect
      }}
      initial={{ y: 0, scale: 0 }}
      animate={{
        y: -1200, // تتحرك لفوق
        scale: [0, 1, 0.5],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "loop",
        delay: delay,
      }}
    />
  );
}
