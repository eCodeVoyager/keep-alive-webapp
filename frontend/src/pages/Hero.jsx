import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Coffee, Code, ArrowRight, Heart } from "lucide-react";
import AnimatedLogo from "../components/Shared/AnimatedLogo";

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 !pb-0 md:!pb-0 flex flex-col items-center justify-between min-h-screen">
        {/* Main Content (your existing code) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center w-full max-w-4xl mx-auto"
        >
          {/* Logo Section */}
          <motion.div variants={item} className="mb-6 md:mb-8">
            <AnimatedLogo className="w-20 h-20 md:w-24 md:h-24 mx-auto" />
          </motion.div>

          {/* Headline Section */}
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight px-4"
          >
            Never Let Your Free Projects
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {" "}
              Go to Sleep
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4"
          >
            Keep your Render, Azure, and other free-tier hosted projects alive
            24/7. Perfect for portfolios, demos, and side projects.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4"
          >
            <Link
              to="/register"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center justify-center group"
            >
              Start For Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/learn-more"
              className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:from-gray-700 hover:to-gray-600 transition duration-300 border border-gray-600"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16 px-4"
          >
            {[
              { number: "10k+", label: "Active Projects" },
              { number: "99.9%", label: "Uptime" },
              { number: "5k+", label: "Developers" },
              { number: "24/7", label: "Monitoring" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm"
              >
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4"
          >
            {[
              {
                icon: Coffee,
                title: "Free Tier Friendly",
                description:
                  "Perfect for projects hosted on Render, Azure, or any free-tier platform",
                color: "text-purple-400",
              },
              {
                icon: Zap,
                title: "Always Active",
                description: "Automated pings keep your projects running 24/7",
                color: "text-green-400",
              },
              {
                icon: Code,
                title: "Developer First",
                description:
                  "Simple setup - just add your URL and we handle the rest",
                color: "text-blue-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <feature.icon
                    className={`w-10 h-10 md:w-12 md:h-12 ${feature.color}`}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer Section */}
        <motion.footer
          variants={container}
          className="w-full max-w-6xl mx-auto mt-16 border-t border-gray-800"
        >
          <div className="relative z-10 container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 py-6">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div className="w-full border-t border-gray-800">
            <div className="px-4 h-16 flex items-center justify-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by</span>
              <a
                href="https://github.com/eCodeVoyager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Ehsan
              </a>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Hero;
