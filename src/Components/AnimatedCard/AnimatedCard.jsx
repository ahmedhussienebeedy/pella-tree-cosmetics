import { motion } from "framer-motion";

export default function AnimatedCard({ image, title, description }) {
  return (
   <>
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden w-72 h-96 flex flex-col items-center p-4 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        rotate: 2,
        boxShadow: "0 20px 30px rgba(0,0,0,0.3)",
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-40 h-40 object-contain mb-4"
      />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </motion.div>
   </>
  );
}
