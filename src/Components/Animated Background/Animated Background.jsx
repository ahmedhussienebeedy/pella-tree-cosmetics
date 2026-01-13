import { motion } from "framer-motion";
import Bubble from "../Bubble/Bubble";

export default function AnimatedGradientBackground() {
  const bubblesData = [
    { size: 50, color: "#FFD700", x: 10, delay: 0 },
    { size: 80, color: "#FF69B4", x: 25, delay: 2 },
    { size: 100, color: "#00FFFF", x: 40, delay: 4 },
    { size: 200, color: "#FF4500", x: 55, delay: 1 },
    { size: 35, color: "#ADFF2F", x: 70, delay: 3 },
    { size: 20, color: "#FF1493", x: 85, delay: 5 },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Animated gradient */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(270deg, #ff7eb9, #ff758c, #ff7eb9, #ff758c)",
          backgroundSize: "800% 800%",
          animation: "gradientAnimation 15s ease infinite",
        }}
      />

      {/* Floating bubbles */}
      {bubblesData.map((bubble, i) => (
        <Bubble
          key={i}
          size={bubble.size}
          color={bubble.color}
          x={bubble.x}
          delay={bubble.delay}
        />
      ))}
    </div>
  );
}
