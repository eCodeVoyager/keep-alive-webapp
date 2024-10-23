import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  Plus,
  Minus,
  Server,
  Clock,
  CreditCard,
  Shield,
  Settings,
  Coffee,
  AlertCircle,
} from "lucide-react";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "general", name: "General", icon: Coffee },
    { id: "technical", name: "Technical", icon: Server },
    { id: "billing", name: "Billing", icon: CreditCard },
    { id: "security", name: "Security", icon: Shield },
    { id: "account", name: "Account", icon: Settings },
  ];

  const faqItems = [
    {
      category: "general",
      question: "What is Keep-Alive?",
      answer:
        "Keep-Alive is a service that prevents your free-tier web projects from going to sleep by sending regular pings. It's perfect for developers using platforms like Render, Heroku, or Azure who want to keep their projects running 24/7 without upgrading to paid tiers.",
    },
    {
      category: "general",
      question: "How does Keep-Alive work?",
      answer:
        "Keep-Alive works by sending periodic HTTP requests to your specified URLs at customizable intervals. These requests keep your applications active and prevent them from entering sleep mode due to inactivity.",
    },
    {
      category: "technical",
      question: "What ping intervals are available?",
      answer:
        "Free tier users get 15-minute ping intervals, while paid users can set custom intervals as low as 5 minutes. Enterprise users can configure intervals down to 1 minute based on their specific needs.",
    },
    {
      category: "technical",
      question: "Does Keep-Alive work with all hosting providers?",
      answer:
        "Keep-Alive works with most hosting providers that have sleep/idle policies for free tier applications. This includes popular platforms like Render, Heroku, Azure, and more. Check our compatibility list for specific details.",
    },
    {
      category: "billing",
      question: "How much does Keep-Alive cost?",
      answer:
        "Keep-Alive offers a free tier for up to 2 projects. Our Developer plan starts at $5/month for up to 10 projects, and our Team plan is $15/month for unlimited projects. Custom enterprise plans are also available.",
    },
    {
      category: "billing",
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade, downgrade, or cancel your plan at any time. Plan changes take effect at the start of the next billing cycle. Upgrades give you immediate access to new features.",
    },
    {
      category: "security",
      question: "How secure is Keep-Alive?",
      answer:
        "We use industry-standard encryption for all data in transit and at rest. Your project URLs are encrypted, and we only perform GET requests to your specified endpoints. We never store or access any of your application data.",
    },
    {
      category: "security",
      question: "What data do you collect?",
      answer:
        "We only collect essential data needed to provide our service: your email, project URLs, and basic usage statistics. We never access your application data or store response content from ping requests.",
    },
    {
      category: "account",
      question: "How do I add or remove projects?",
      answer:
        "You can manage your projects through the dashboard. Simply click 'Add Project' to add a new URL, or use the project settings menu to remove or modify existing projects. Changes take effect immediately.",
    },
    {
      category: "account",
      question: "How can I monitor my projects' status?",
      answer:
        "The dashboard provides real-time status monitoring for all your projects. You can view uptime statistics, ping history, and set up custom alerts for when your projects go down or experience issues.",
    },
  ];

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFaqs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-20"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-block mb-6"
          >
            <HelpCircle className="w-16 h-16 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about Keep-Alive. Can't find what
            you're looking for?{" "}
            <a href="/contact" className="text-green-400 hover:text-green-300">
              Contact our support team
            </a>
            .
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">
                No questions found. Try adjusting your search.
              </p>
            </div>
          ) : (
            filteredFaqs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full bg-gray-800 rounded-lg p-6 text-left hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white pr-8">
                      {item.question}
                    </h3>
                    {expandedItems.has(index) ? (
                      <Minus className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <Plus className="w-6 h-6 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  {expandedItems.has(index) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 text-gray-300 leading-relaxed"
                    >
                      {item.answer}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-300 mb-8">
            Our support team is available 24/7 to answer any questions you may
            have.
          </p>
          <a
            href="/contact"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
          >
            Contact Support
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
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FAQPage;
