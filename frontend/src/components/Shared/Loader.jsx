import { motion } from "framer-motion";
import { Loader as LucideLoader } from "lucide-react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div animate={{ rotate: 360 }}>
        <LucideLoader className="h-16 w-16 text-green-500" />
      </motion.div>
    </div>
  );
};

export default Loader;
