import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Heart,
  Eye,
  Moon,
  Brain,
  Compass,
  Shield,
} from "lucide-react";

const HowAIInterpretsDreams = () => {
  const [scrollY, setScrollY] = useState(0);
  const [emotionValue, setEmotionValue] = useState(50);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const processSteps = [
    {
      icon: Eye,
      title: "We See Symbols",
      description:
        "Dreams speak in metaphors. A door isn't just a door — it might represent opportunity, transition, or the unknown. We identify these universal and personal symbols.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Heart,
      title: "We Feel Emotions",
      description:
        "The feeling you carried in the dream often matters more than the events. Were you anxious? Joyful? Peaceful? Emotions are the compass pointing to what your subconscious is processing.",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: Brain,
      title: "We Recognize Patterns",
      description:
        "Recurring themes, familiar places, repeated scenarios — these aren't random. They're your mind working through unresolved thoughts, desires, or fears. Patterns reveal priorities.",
      color: "from-purple-400 to-indigo-400",
    },
    {
      icon: Compass,
      title: "We Reflect Context",
      description:
        "A dream of flying might mean freedom for one person and escape for another. Context matters. We consider your life circumstances, cultural background, and personal associations.",
      color: "from-amber-400 to-orange-400",
    },
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${50 + scrollY * 0.02}% ${
              50 - scrollY * 0.01
            }%, #6366f1, #8b5cf6, #ec4899, #0f172a)`,
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
            style={{
              left: particle.left,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fadeInUp">
            <Moon className="w-16 h-16 mx-auto mb-8 text-purple-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              How AI Interprets Dreams
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Not prediction. Not fortune-telling. Just a quiet conversation
              with the symbols your mind creates while you sleep.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Introduction Quote */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <Sparkles className="w-12 h-12 text-purple-400 mb-6" />
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-slate-200 italic">
              &quot;Dreams are letters from the subconscious. AI helps us read
              them — not to predict the future, but to understand the
              present.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* The Process - Card Grid */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="fade-in-section py-32 px-6 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            The Four Pillars of Dream Interpretation
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep Context Section — Understanding, not decoding */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Understanding, not decoding
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left: Pull Quote */}
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-purple-300">
                  AI doesn’t tell you what a dream means.
                </p>
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate-300 mt-4">
                  It helps you notice what your mind is already saying.
                </p>
              </div>

              {/* Right: Long-form Explanation */}
              <div className="space-y-5 text-slate-300 leading-relaxed text-base">
                <p>
                  Dreams aren’t puzzles with one correct answer. They are
                  narratives shaped by memory, emotion, and personal experience,
                  unfolding in a language that is symbolic rather than literal.
                </p>

                <p>
                  Traditional dream dictionaries often flatten this complexity,
                  assigning fixed meanings to symbols without considering who is
                  dreaming, when the dream occurred, or what emotional context
                  surrounds it.
                </p>

                <p>
                  AI approaches dream interpretation differently. Instead of
                  predicting outcomes or assigning rigid definitions, it
                  observes relationships — between symbols, emotional shifts,
                  recurring themes, and narrative flow.
                </p>

                <p>
                  A dream about falling after a major life transition carries a
                  very different emotional weight than the same dream during a
                  period of stability. Context reshapes meaning.
                </p>

                <p>
                  By surfacing patterns rather than conclusions, AI creates
                  space for reflection. The interpretation becomes a mirror —
                  not an answer — inviting you to explore what resonates rather
                  than what is declared true.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emotion Slider */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h3 className="text-3xl font-semibold mb-4 text-center">
              Feel Your Dream
            </h3>
            <p className="text-slate-400 text-center mb-8">
              Emotions shape meaning. Move the slider to explore how feelings
              transform interpretation.
            </p>

            <div className="space-y-8">
              <input
                type="range"
                min="0"
                max="100"
                value={emotionValue}
                onChange={(e) => setEmotionValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              />

              <div className="flex justify-between text-sm text-slate-500">
                <span>Fear</span>
                <span>Neutral</span>
                <span>Joy</span>
              </div>

              <div className="text-center mt-8 p-6 bg-slate-900/50 rounded-2xl">
                <p className="text-lg text-slate-300">
                  {emotionValue < 30 &&
                    "Your dream might be processing anxiety or concerns. That's healthy — your mind is working through challenges."}
                  {emotionValue >= 30 &&
                    emotionValue < 70 &&
                    "Neutral dreams often reflect daily processing. Your subconscious is organizing thoughts and memories."}
                  {emotionValue >= 70 &&
                    "Joyful dreams can signal contentment or hope. They're your mind celebrating possibilities and positive connections."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Visual Quote */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="fade-in-section relative py-48 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-purple-950 to-pink-950 opacity-50" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-5xl font-light leading-relaxed text-white">
            &quot;We don&apos;t tell you what your dream means. <br />
            <span className="text-purple-300">
              We help you discover what it might mean to you.
            </span>
            &quot;
          </p>
        </div>
      </section>

      {/* What We Don't Do */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What AI Dream Interpretation Is{" "}
            <span className="text-slate-500 italic">Not</span>
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "Not Prediction",
                desc: "We don't claim to forecast the future. Dreams reflect the present, not destiny.",
              },
              {
                title: "Not Medical Advice",
                desc: "If you're experiencing distressing dreams or mental health concerns, please consult a professional.",
              },
              {
                title: "Not Absolute Truth",
                desc: "Interpretations are starting points for reflection, not definitive answers.",
              },
              {
                title: "Not One-Size-Fits-All",
                desc: "The same symbol can mean different things to different people. Context is everything.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800"
              >
                <h3 className="text-xl font-semibold mb-2 text-rose-400">
                  {item.title}
                </h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics & Trust */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        className="fade-in-section py-32 px-6 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"
      >
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-8 text-blue-400" />
          <h2 className="text-4xl font-bold mb-8">Our Commitment to You</h2>
          <div className="space-y-6 text-left bg-slate-900/30 rounded-3xl p-10 border border-white/10">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Privacy First:</strong> Your dreams
              are deeply personal. We never share or sell your data.
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Respectful Interpretation:</strong>{" "}
              We approach every dream with care, avoiding harmful stereotypes or
              judgment.
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Human-Centered AI:</strong>{" "}
              Technology serves insight, not replacement. You are the ultimate
              interpreter of your dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        ref={(el) => (sectionsRef.current[7] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to explore your dreams?
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            Start a conversation with your subconscious tonight.
          </p>
          <a
            href="/"
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-lg font-semibold shadow-2xl shadow-purple-500/50 hover:shadow-purple-600/50 transition-all transform hover:scale-105 active:scale-95"
          >
            Analyze Your Dream
          </a>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(-10px) translateX(-20px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default HowAIInterpretsDreams;
