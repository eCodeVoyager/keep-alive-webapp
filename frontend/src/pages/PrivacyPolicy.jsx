import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LockIcon, Shield, Eye } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us, including email address, project URLs, and usage data. We also automatically collect certain information about your device and how you interact with our service.",
      icon: Eye,
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use collected information to provide and improve our services, send notifications about your projects' status, and ensure service reliability. Your project URLs are used solely for ping operations.",
      icon: Shield,
    },
    {
      title: "3. Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your information. Project URLs are encrypted at rest and in transit. We regularly review and update our security practices.",
      icon: LockIcon,
    },
    {
      title: "4. Data Retention",
      content:
        "We retain your information as long as your account is active or as needed to provide services. You can request data deletion at any time through your account settings or by contacting support.",
      icon: Shield,
    },
    {
      title: "5. Information Sharing",
      content:
        "We do not sell your personal information. We may share data with service providers who assist in our operations, subject to confidentiality obligations.",
      icon: Eye,
    },
    {
      title: "6. Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also object to processing and request data portability. Contact our support team to exercise these rights.",
      icon: Shield,
    },
    {
      title: "7. Cookies and Tracking",
      content:
        "We use cookies and similar technologies to maintain your preferences and provide our service. You can control cookie settings through your browser preferences.",
      icon: Eye,
    },
    {
      title: "8. Updates to Privacy Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of material changes via email or through our service before they become effective.",
      icon: Shield,
    },
  ];

  return (
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
            <LockIcon className="w-16 h-16 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We take your privacy seriously. This policy explains how we collect,
            use, and protect your information. Last updated: October 24, 2024
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
              <div className="flex items-start">
                <section.icon className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">
              For questions about our privacy practices or to exercise your
              rights, please contact our Data Protection Officer.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/contact"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
              >
                Contact DPO
                <Shield className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/dashboard/settings"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
              >
                Privacy Settings
                <LockIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
