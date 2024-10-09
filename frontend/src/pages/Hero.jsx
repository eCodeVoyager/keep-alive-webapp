import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, Server, Users } from "lucide-react";
import AnimatedLogo from "../components/Shared/AnimatedLogo";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4 max-md:pt-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <AnimatedLogo />

        <h1 className="text-5xl font-bold text-white mb-4">Keep-Alive</h1>
        <p className="text-xl text-gray-300 mb-8">
          Ensure your servers stay active, always.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="bg-transparent border border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: Server,
            title: "Server Monitoring",
            description: "Keep track of your servers' status in real-time",
          },
          {
            icon: Activity,
            title: "Automatic Pinging",
            description: "Set up automated pings to keep your servers active",
          },
          {
            icon: Users,
            title: "Team Collaboration",
            description: "Work together to manage your server infrastructure",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg text-center"
          >
            <feature.icon className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;
