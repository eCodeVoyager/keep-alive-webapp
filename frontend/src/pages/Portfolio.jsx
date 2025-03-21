import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import {
  ArrowDown,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  CircleDot,
} from "lucide-react";

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div
        className="w-full h-full border-2 border-white rounded-full"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
};

const MagneticButton = ({ children, className }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const button = buttonRef.current;
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseLeave={resetPosition}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const TextReveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="overflow-hidden"
    >
      <motion.div>{children}</motion.div>
    </motion.div>
  );
};

const WorkProcess = () => {
  const processes = [
    {
      title: "Discovery",
      description:
        "Understanding project requirements and user needs through deep research",
      icon: CircleDot,
    },
    {
      title: "Strategy",
      description:
        "Developing comprehensive technical approach and architecture",
      icon: CircleDot,
    },
    {
      title: "Design",
      description: "Creating intuitive interfaces with modern aesthetic",
      icon: CircleDot,
    },
    {
      title: "Development",
      description: "Building scalable solutions with clean, efficient code",
      icon: CircleDot,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {processes.map((process, index) => (
        <motion.div
          key={process.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ y: -10 }}
          className="p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
        >
          <process.icon className="w-8 h-8 mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2 text-white">
            {process.title}
          </h3>
          <p className="text-gray-400">{process.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

const Portfolio = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const projects = [
    {
      title: "E-commerce Platform",
      tech: ["React", "Next.js", "TypeScript"],
      year: "2024",
    },
    {
      title: "AI Dashboard",
      tech: ["React", "TailwindCSS", "Python"],
      year: "2024",
    },
    {
      title: "Social Media App",
      tech: ["React Native", "Firebase"],
      year: "2023",
    },
    {
      title: "Portfolio Website",
      tech: ["React", "Framer Motion"],
      year: "2023",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e1111] text-gray-400">
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-[0%] z-50"
        style={{ scaleX }}
      />

      <header
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-[#0e1111]/80 backdrop-blur-md" : ""
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <TextReveal>
            <div className="text-sm tracking-wider text-white">
              OLUWAGAMIE
              <br />
              OLUWAEYI
            </div>
          </TextReveal>
          <div className="flex items-center gap-12">
            <div className="hidden md:block text-sm">
              <TextReveal>
                FRONTEND DEVELOPER
                <br />
                FOLIO / 2023 — 2024
              </TextReveal>
            </div>
            <MagneticButton className="px-6 py-2 border border-gray-800 rounded-full text-sm hover:bg-white hover:text-black transition-colors duration-300">
              CONTACT
            </MagneticButton>
          </div>
        </div>
      </header>

      <section className="min-h-screen pt-32 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-[8vw] md:text-[12vw] font-bold leading-none text-white opacity-90 select-none">
              FRONT
              <br />
              <span className="inline-block w-32 h-2 bg-white mx-8"></span>
              END
              <br />
              DEVELOPER
            </h1>

            <div className="absolute top-1/2 right-0 max-w-xs text-sm leading-relaxed">
              <TextReveal>
                I am a developer based in Lagos, Nigeria focused on creating
                interactive digital experiences on the web, working with brands
                and industry leaders such as GOOGLE FONTS, PAYSTACK, PRINTIVO,
                DISNEY, JELLY, and NULL amongst others to achieve this.
              </TextReveal>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-sm">Scroll down</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <TextReveal>
            <h2 className="text-4xl font-bold mb-16 text-white">
              Selected Works
            </h2>
          </TextReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-6 rounded-xl bg-gray-900/30 border border-gray-800/50 hover:border-gray-700 transition-colors duration-300"
              >
                <div className="aspect-video bg-gray-800 mb-6 overflow-hidden rounded-lg">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-white">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  {project.tech.map((tech, i) => (
                    <React.Fragment key={tech}>
                      <span>{tech}</span>
                      {i < project.tech.length - 1 && <span>•</span>}
                    </React.Fragment>
                  ))}
                  <span className="ml-auto">{project.year}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <TextReveal>
            <h2 className="text-4xl font-bold mb-16 text-white">
              Work Process
            </h2>
          </TextReveal>
          <WorkProcess />
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <TextReveal>
              <div className="text-3xl font-bold text-white">
                Let's work together
              </div>
            </TextReveal>
            <div className="text-sm">
              <TextReveal>
                Lagos, Nigeria
                <br />
                GMT+1
              </TextReveal>
            </div>
            <div className="flex gap-6">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            © 2024 All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
