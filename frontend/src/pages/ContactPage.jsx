import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      info: "Average response time: 5 minutes",
      color: "text-blue-400",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      info: "support@keepalive.com",
      color: "text-green-400",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      info: "+1 (555) 123-4567",
      color: "text-yellow-400",
    },
  ];

  const officeHours = [
    {
      day: "Monday - Friday",
      hours: "9:00 AM - 6:00 PM EST",
    },
    {
      day: "Saturday",
      hours: "10:00 AM - 4:00 PM EST",
    },
    {
      day: "Sunday",
      hours: "Closed",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-20"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-block mb-6"
          >
            <MessageSquare className="w-16 h-16 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about Keep-Alive? We're here to help 24/7. Choose
            your preferred way to reach us.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <method.icon className={`w-12 h-12 ${method.color} mb-4`} />
              <h3 className="text-xl font-semibold text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-400 mb-4">{method.description}</p>
              <p className="text-green-400 font-semibold">{method.info}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
        >
          {/* Form */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Subject</label>
                <select className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-400">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Feature Request</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-400 h-32"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>

          {/* Office Hours & Location */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-green-400" />
                Office Hours
              </h2>
              <div className="space-y-4">
                {officeHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span>{schedule.day}</span>
                    <span>{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-400" />
                Our Location
              </h2>
              <p className="text-gray-300 mb-4">
                123 Tech Street
                <br />
                Silicon Valley
                <br />
                CA 94025, USA
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">
                Connect With Us
              </h2>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-300 mb-4">
            Looking for quick answers? Check out our FAQ section.
          </p>
          <a
            href="/faq"
            className="text-green-400 hover:text-green-300 font-semibold inline-flex items-center"
          >
            Visit FAQ
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

export default ContactPage;
