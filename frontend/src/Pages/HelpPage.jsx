import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import faqSections from "../data/faqData.json";
import DreamPersonalityTypes from "../data/DreamPersonalityTypes.json";
import HelpAccordion from "../components/widgets/HelpAccordion";
import { DPTCard } from "../components/widgets/DPTCard";
import DreamAnalysisTimeline from "../components/widgets/DreamAnalysisTimeline";
import FeedbackSection from "../components/widgets/FeedbackSection";
import GlossarySection from "../components/widgets/GolssarySection";
import HelpHeroSection from "../components/widgets/HelpHeroSection";

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      questions: section.questions.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <div className="min-h-screen  px-4 sm:px-8 md:px-16 py-10 space-y-24">
      {/* Hero Section */}
      <section>
        <HelpHeroSection />
      </section>

      {/* Search Section */}
      <section
        id="faq"
        className="relative flex flex-col gap-8  mx-auto bg-[#29254a] backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="self-center w-[75%] max-w-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/10"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-white">
            🔍 Ask the Dream Oracle
          </h2>
          <Input
            placeholder="Search dream questions..."
            className="w-full focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* FAQ Section */}
        <section className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/10 space-y-4 max-h-[500px] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence>
              {filteredSections.length > 0 ? (
                <HelpAccordion filteredSections={filteredSections} />
              ) : (
                <motion.p
                  className="text-center text-muted-foreground mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  🤔 No questions match your search.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </section>

      {/* Dream Analysis Timeline */}
      <section className="bg-[#29254a] p-8 rounded-3xl shadow-lg border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            🔮 How Dream Analysis Works
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Learn how AI and psychology blend to interpret your dreams.
          </p>
          <DreamAnalysisTimeline />
        </motion.div>
      </section>

      {/* Dream Personality Section */}
      <section className="bg-[#29254a] p-8 rounded-3xl shadow-lg border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-white text-center">
            🌟 Discover Your Dream Archetype
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Explore personality types that echo through your subconscious
            journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {DreamPersonalityTypes.map((dpt) => (
              <DPTCard key={dpt.id} DPT={{ type: dpt.id }} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Glossary Section */}
      <section className="bg-[#29254a] p-8 rounded-3xl shadow-lg border border-white/10">
        <GlossarySection />
      </section>

      {/* Feedback Section */}
      <section
        id="support"
        className="bg-[#29254a] p-8 rounded-3xl shadow-lg border border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-2 text-white text-center">
            💬 Whisper to the Dreamkeepers
          </h2>
          <p className="text-sm text-white/60 text-center mb-6">
            Found a bug, have a dream idea, or just want to say hi? Let us know.
          </p>
          <FeedbackSection />
        </motion.div>
      </section>
    </div>
  );
};

export default HelpPage;
