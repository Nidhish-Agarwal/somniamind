import React, { useState, useEffect, useRef } from "react";
import { Moon, Star, Brain, Heart, Eye, Book, Compass } from "lucide-react";

const WhyWeDream = () => {
  const [scrollY, setScrollY] = useState(0);
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
      { threshold: 0.15, rootMargin: "-50px" }
    );

    sectionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const culturalPerspectives = [
    {
      culture: "Ancient Egypt",
      period: "~3000 BCE",
      belief:
        "Dreams were messages from the gods. Priests kept dream books to decode divine warnings and blessings.",
      color: "from-amber-600/20 to-orange-700/20",
    },
    {
      culture: "Indigenous Australia",
      period: "50,000+ years",
      belief:
        "The Dreamtime — where past, present, and creation exist together. Dreams connect the living to ancestral spirits and the land itself.",
      color: "from-emerald-600/20 to-teal-700/20",
    },
    {
      culture: "Ancient Greece",
      period: "~500 BCE",
      belief:
        "Dreams were visits from gods or the dead. Temples of Asclepius offered 'dream incubation' — sleeping to receive healing visions.",
      color: "from-blue-600/20 to-indigo-700/20",
    },
    {
      culture: "Medieval Islam",
      period: "~700–1400 CE",
      belief:
        "True dreams came from Allah; false ones from the self or shaitan. Dream interpreters held honored positions in society.",
      color: "from-purple-600/20 to-violet-700/20",
    },
  ];

  return (
    <div className=" border border-slate-950 min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at ${50 + scrollY * 0.03}% ${
              40 - scrollY * 0.02
            }%, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2), transparent 70%)`,
          }}
        />

        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Moon className="w-20 h-20 mx-auto mb-12 text-indigo-300/60 animate-float" />

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight animate-fadeInUp">
            Why We Dream
          </h1>

          <p className="text-xl md:text-2xl text-slate-300/80 font-light leading-relaxed max-w-2xl mx-auto animate-fadeInUp delay-200">
            Every night, your mind creates worlds. <br />
            Why? No one truly knows. <br />
            But perhaps the mystery itself is the point.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="text-slate-400 text-sm animate-bounce">scroll</div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32" />

      {/* The Science of Dreaming */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="fade-in-section py-24 px-6"
      >
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center mb-16">
            <Brain className="w-12 h-12 mx-auto mb-6 text-indigo-400" />
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              What happens when we sleep
            </h2>
          </div>

          <div className="space-y-8 text-lg leading-loose text-slate-300">
            <p>
              During REM sleep — rapid eye movement — your brain becomes nearly
              as active as when you're awake. But your body is paralyzed,
              keeping you safe from acting out the scenes unfolding in your
              mind.
            </p>

            <p>
              In this state, your brain processes emotions, consolidates
              memories, and makes unexpected connections. Yesterday's worry
              becomes tonight's monster. Last year's joy reappears as a familiar
              face.
            </p>

            <div className="my-16 p-8 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 rounded-3xl border border-indigo-900/30">
              <p className="text-xl italic text-indigo-200 leading-relaxed">
                Dreams don't follow logic. They follow feeling. Your mind isn't
                trying to make sense — it's trying to{" "}
                <span className="text-white font-medium">feel</span> sense.
              </p>
            </div>

            <p>
              The hippocampus, which stores memory, talks to the amygdala, which
              holds emotion. Together, they weave fragments into stories. A
              childhood home. A forgotten song. A person you haven't thought
              about in years.
            </p>

            <p>
              Some researchers believe dreams help us rehearse responses to
              threats. Others think they're the brain's way of filing away the
              day. Still others suggest dreams serve no purpose at all — just
              noise from a resting mind.
            </p>

            <p className="text-slate-400 italic">
              The truth? We're still learning. And maybe that's okay.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32" />

      {/* Cultural Timeline */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="fade-in-section py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <Compass className="w-12 h-12 mx-auto mb-6 text-purple-400" />
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Dreams across time and culture
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Long before neuroscience, humans were asking the same question:
              why do we dream?
            </p>
          </div>

          <div className="space-y-6">
            {culturalPerspectives.map((item, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-500`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 mt-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-3">
                      <h3 className="text-2xl font-medium text-white">
                        {item.culture}
                      </h3>
                      <span className="text-sm text-slate-400">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {item.belief}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-slate-400 italic max-w-2xl mx-auto">
              Across every culture and era, dreams have been treated as
              meaningful. Not random. Not meaningless.{" "}
              <span className="text-slate-200">Significant.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32" />

      {/* Modern Psychology */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="fade-in-section py-24 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Heart className="w-12 h-12 mx-auto mb-6 text-rose-400" />
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              What dreams do for us now
            </h2>
          </div>

          <div className="space-y-12 text-lg leading-loose text-slate-300">
            <div>
              <h3 className="text-2xl text-white mb-4 font-medium">
                Emotional processing
              </h3>
              <p>
                Dreams give us a safe space to feel things we can't fully
                process while awake. Grief. Anxiety. Joy. Desire. In dreams,
                emotions aren't filtered by logic or social expectations.
              </p>
            </div>

            <div className="my-12 p-10 bg-gradient-to-br from-rose-950/30 to-pink-950/30 rounded-3xl border border-rose-900/20">
              <p className="text-2xl italic text-rose-200 leading-relaxed text-center">
                "The dream is the small hidden door in the deepest and most
                intimate sanctum of the soul."
              </p>
              <p className="text-right text-slate-400 mt-4">— Carl Jung</p>
            </div>

            <div>
              <h3 className="text-2xl text-white mb-4 font-medium">
                Memory integration
              </h3>
              <p>
                Your brain doesn't just store memories — it connects them. A new
                experience might remind you of something from childhood. Dreams
                help create these threads, linking past and present into a
                cohesive sense of self.
              </p>
            </div>

            <div>
              <h3 className="text-2xl text-white mb-4 font-medium">
                Rehearsing the future
              </h3>
              <p>
                Some dreams feel like practice. You confront a fear. Navigate a
                difficult conversation. Escape danger. These simulations might
                prepare us for real-world challenges, even if the scenarios
                themselves are surreal.
              </p>
            </div>

            <div>
              <h3 className="text-2xl text-white mb-4 font-medium">
                Creative problem-solving
              </h3>
              <p>
                When you're stuck on a problem, your conscious mind can get in
                the way. Dreams bypass that. Artists, scientists, and inventors
                have credited dreams with breakthroughs — from Mendeleev's
                periodic table to Paul McCartney's "Yesterday."
              </p>
            </div>

            <p className="text-slate-400 italic pt-8">
              But here's the thing: dreams don't always have a purpose.
              Sometimes they're just... dreams. And that's enough.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32" />

      {/* Reflective Pause */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="fade-in-section py-32 px-6"
      >
        <div className="max-w-2xl mx-auto text-center space-y-16">
          <Eye className="w-16 h-16 mx-auto text-indigo-300/60" />

          <div className="space-y-8">
            <p className="text-3xl md:text-4xl font-light text-slate-200 leading-relaxed">
              What emotions repeat in your dreams?
            </p>

            <p className="text-3xl md:text-4xl font-light text-slate-200 leading-relaxed">
              What moments return uninvited?
            </p>

            <p className="text-3xl md:text-4xl font-light text-slate-200 leading-relaxed">
              What places feel like home, even if you've never been there?
            </p>
          </div>

          <div className="h-32" />

          <p className="text-xl text-slate-400 italic leading-loose">
            These aren't questions with easy answers. <br />
            But they're worth sitting with.
          </p>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32" />

      {/* Closing Invitation */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="fade-in-section py-24 px-6 mb-32"
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-pink-950/40 rounded-3xl p-12 md:p-16 border border-white/10 text-center space-y-8">
            <Star className="w-12 h-12 mx-auto text-purple-400" />

            <h2 className="text-3xl md:text-4xl font-light leading-relaxed">
              Dreaming is deeply personal
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
              No two people dream the same way. No symbol means exactly one
              thing. Your dreams belong to you — shaped by your memories, your
              emotions, your life.
            </p>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
              We can't tell you why you dream. But we can help you reflect on
              what your dreams might be telling you.
            </p>

            <div className="pt-8">
              <a
                href="/"
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-lg font-medium shadow-2xl shadow-purple-500/30 hover:shadow-purple-600/40 transition-all transform hover:scale-105 active:scale-95"
              >
                Explore Your Dreams
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background-color: rgba(139, 92, 246, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default WhyWeDream;
