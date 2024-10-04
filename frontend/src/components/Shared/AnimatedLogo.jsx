import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const AnimatedLogo = () => {
  return (
    <div className="relative w-20 h-20 mx-auto mb-8">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Activity className="w-12 h-12 text-white" />
      </motion.div>
      <motion.div
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-white rounded-full"
      />
    </div>
  );
};

export default AnimatedLogo;
