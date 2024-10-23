import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Clock,
  Shield,
  Activity,
  Server,
  Bell,
  Code,
  Coffee,
  Coins,
} from "lucide-react";
import AnimatedLogo from "../components/Shared/AnimatedLogo";

const LearnMore = () => {
  const features = [
    {
      icon: Coffee,
      title: "Keep Your Projects Alive",
      description:
        "Prevent your free-tier projects on Render, Azure, or other cloud platforms from going to sleep. Perfect for hobby projects, portfolios, and demos.",
      color: "text-purple-400",
    },
    {
      icon: Clock,
      title: "Smart Interval Pinging",
      description:
        "Automatically ping your projects every 10-15 minutes to keep them active. Customizable intervals to match your hosting provider's sleep policies.",
      color: "text-blue-400",
    },
    {
      icon: Code,
      title: "Developer-Friendly",
      description:
        "Ideal for personal projects, portfolios, demo apps, and side projects. No complex setup required - just add your URL and we'll keep it running.",
      color: "text-green-400",
    },
    {
      icon: Activity,
      title: "Uptime Monitoring",
      description:
        "Track your project's uptime and get notified if it goes down. Perfect for ensuring your portfolio is always available for potential employers.",
      color: "text-yellow-400",
    },
    {
      icon: Coins,
      title: "Save on Hosting Costs",
      description:
        "Make the most of free-tier hosting plans without upgrading to paid tiers. Perfect for developers managing multiple projects on a budget.",
      color: "text-red-400",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your project URLs are encrypted and secure. We only ping the endpoints you specify, with no access to your application data.",
      color: "text-indigo-400",
    },
  ];

  const plans = [
    {
      name: "Hobby",
      price: "Free",
      features: [
        "Up to 2 projects",
        "15-minute ping intervals",
        "24-hour uptime monitoring",
        "Basic email alerts",
      ],
      highlighted: false,
    },
    {
      name: "Developer",
      price: "$5",
      features: [
        "Up to 10 projects",
        "5-minute ping intervals",
        "7-day uptime monitoring",
        "Instant downtime alerts",
        "Custom ping paths",
      ],
      highlighted: true,
    },
    {
      name: "Team",
      price: "$15",
      features: [
        "Unlimited projects",
        "Custom ping intervals",
        "30-day uptime monitoring",
        "Priority support",
        "Team collaboration",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <AnimatedLogo />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Keep Your Free-Tier Projects Running{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              24/7
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stop your free-hosted projects from going to sleep! Perfect for
            developers using Render, Azure, or other cloud platforms with free
            tiers. Keep your portfolios, demos, and side projects always
            available without paying for premium hosting.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-8 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Server className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-4xl font-bold text-white mb-2">10k+</h4>
              <p className="text-gray-400">Projects Kept Alive</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-4xl font-bold text-white mb-2">99.9%</h4>
              <p className="text-gray-400">Ping Success Rate</p>
            </div>
            <div className="text-center">
              <Coffee className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-4xl font-bold text-white mb-2">5k+</h4>
              <p className="text-gray-400">Happy Developers</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-gray-800 rounded-xl p-6 ${
                plan.highlighted ? "ring-2 ring-green-400" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-green-400 mb-4">
                {plan.price}
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`w-full text-center block py-2 px-4 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                Start Free
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Let Your Projects Sleep Again
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of developers who keep their free-tier projects
            running 24/7 with Keep-Alive. Perfect for portfolios, demos, and
            side projects.
          </p>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
          >
            Start For Free
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LearnMore;
