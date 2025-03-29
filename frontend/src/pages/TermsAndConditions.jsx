import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ScrollText } from "lucide-react";
import SEO from "../components/Shared/SEO";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Terms of Use",
      content:
        "By accessing and using Keep-Alive services, you agree to be bound by these terms and conditions. If you disagree with any part of these terms, you may not access our service.",
    },
    {
      title: "2. Service Description",
      content:
        "Keep-Alive provides automated ping services to keep web applications active. While we strive for 100% uptime, we cannot guarantee uninterrupted service and are not liable for any damages resulting from service interruptions.",
    },
    {
      title: "3. User Responsibilities",
      content:
        "Users must provide valid URLs and ensure their applications comply with their hosting providers' terms of service. Users are responsible for maintaining their account security and must not share credentials.",
    },
    {
      title: "4. Fair Usage",
      content:
        "We reserve the right to limit service if usage patterns indicate abuse or could negatively impact other users. Automated access must comply with our API guidelines.",
    },
    {
      title: "5. Account Tiers",
      content:
        "Service features and limitations vary by account tier. We reserve the right to modify tier features with notice. Paid subscriptions are billed according to the terms specified at signup.",
    },
    {
      title: "6. Termination",
      content:
        "We may terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these terms or is harmful to other users, our service, or third parties.",
    },
    {
      title: "7. Limitation of Liability",
      content:
        "Keep-Alive shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.",
    },
    {
      title: "8. Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or service notification.",
    },
  ];

  return (
    <>
      <SEO
        title="Terms and Conditions"
        description="Read Server's terms and conditions to understand our service usage policies, user responsibilities, and account management rules."
        keywords="terms and conditions, Server terms, service agreement, user agreement, website monitoring terms"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-20"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-block mb-6"
            >
              <ScrollText className="w-16 h-16 text-green-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using Keep-Alive
              services. Last updated: October 24, 2024
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}

            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-6">
                If you have any questions about these terms, please contact us.
              </p>
              <Link
                to="/contact"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
              >
                Contact Support
                <Shield className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default TermsAndConditions;
