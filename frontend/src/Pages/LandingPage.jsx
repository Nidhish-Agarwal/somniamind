import React from "react";
import moon from "../assets/moon.png";
import "../styles/Pages/LandingPage.css";
import RandomStars from "../components/RandomStars.jsx";
import RandomCloudsAndStars from "../components/RandomCloudsAndStars.jsx";
import ShootingStars from "../components/ShootingStars.jsx";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a1a40] to-[#0f0f33] overflow-hidden z-0">
        <RandomStars />
        <RandomCloudsAndStars />
        <ShootingStars />
        <img
          src={moon}
          alt="Moon"
          className="absolute top-[10%] right-[10%] w-[12vw] drop-shadow-md transform scale-x-[-1] opacity-80"
        />
      </div>

      {/* Content Wrapper with Scrollable Content */}
      <div className="relative z-10 overflow-y-auto min-h-screen">
        {/* Header */}
        <header className="py-4 bg-opacity-10">
          <div className="container mx-auto flex justify-between items-center px-6 py-2 fixed bg-[#1a1a40] top-0">
            <h1 className="text-4xl font-bold tracking-wide text-yellow-300 glow">
              SomniaMind
            </h1>
            <nav className="flex space-x-6">
              {[
                { label: "Home", href: "#home" },
                { label: "Features", href: "#features" },
                { label: "Community", href: "#community" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-white hover:text-yellow-300 transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h2 className="text-5xl font-extrabold text-gray-50">
            Unveil the Mystery of Dreams
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl">
            Journey into the fascinating world of dreams and their hidden
            meanings. Explore insights tailored for you.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg hover:scale-105 transform transition"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
            </button>
            <button className="px-6 py-2 border border-yellow-400 text-yellow-400 font-medium rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              Learn More
            </button>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 bg-opacity-10">
          <div className="container mx-auto text-center ">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#1a1a40]">
              {[
                {
                  title: "Dream Journal",
                  desc: "Record your dreams with insights and emotions.",
                },
                {
                  title: "AI Dream Analysis",
                  desc: "Get AI-powered interpretations of your dreams.",
                },
                {
                  title: "Gamification",
                  desc: "Level up and unlock achievements as you track dreams!",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 border border-yellow-400 rounded-lg shadow-lg bg-opacity-10"
                >
                  <h4 className="text-2xl font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-16 px-6 bg-opacity-10">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              Join the Community
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Connect with other dreamers, share your insights, and explore a
              world of fascinating dreams.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-6 bg-opacity-10">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="max-w-2xl mx-auto space-y-4 bg-[#1a1a40]">
              {[
                {
                  question: "Is my data secure?",
                  answer:
                    "Yes! We prioritize privacy and security, keeping your dreams safe.",
                },
                {
                  question: "Can I share my dreams with others?",
                  answer:
                    "Yes! Our community lets you post dreams and engage with others.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border border-yellow-400 p-4 rounded-lg"
                >
                  <h4 className="text-xl font-semibold text-white">
                    {faq.question}
                  </h4>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-6 bg-opacity-10">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              Contact Us
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have any questions? Reach out to us!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-opacity-10">
          <div className="container mx-auto text-center text-gray-300">
            © {new Date().getFullYear()} SomniaMind. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
