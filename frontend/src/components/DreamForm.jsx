import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Moon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { trackEvent } from "../analytics/ga";

// Mock components for demonstration
const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Textarea = ({ className, rows = 3, ...props }) => (
  <textarea
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${className}`}
    {...props}
  />
);

const Button = ({
  variant = "default",
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default:
      "bg-purple-600 hover:bg-purple-700 text-white disabled:hover:bg-purple-600",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:hover:bg-transparent",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:hover:bg-transparent",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Label = ({ children, className = "" }) => (
  <label
    className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}
  >
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const moodOptions = [
  {
    emoji: "😭",
    label: "Terrified",
    color: "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700",
  },
  {
    emoji: "😔",
    label: "Sad",
    color: "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700",
  },
  {
    emoji: "😐",
    label: "Neutral",
    color: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
  },
  {
    emoji: "😊",
    label: "Happy",
    color:
      "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700",
  },
  {
    emoji: "🤩",
    label: "Euphoric",
    color:
      "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700",
  },
];

const steps = [
  {
    id: 1,
    title: "Dream Basics",
    subtitle: "Tell us about your dream",
    icon: Moon,
    fields: ["title", "description", "date"],
  },
  {
    id: 2,
    title: "Emotions",
    subtitle: "How did it make you feel?",
    icon: Sparkles,
    fields: ["mood", "intensity"],
  },
  {
    id: 3,
    title: "Dream Elements",
    subtitle: "What appeared in your dream? (Optional)",
    icon: Eye,
    fields: ["symbols", "themes", "characters", "setting"],
  },
  {
    id: 4,
    title: "Additional Context",
    subtitle: "Help us understand better (Optional)",
    icon: Info,
    fields: ["notes_to_ai", "real_life_link"],
  },
];

export default function DreamForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    trackEvent("dream_create_started");
    // ADD THIS:
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      trackEvent("dream_create_abandoned");
      onClose();
    }, 300);
  };

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: today,
    mood: "Neutral",
    intensity: 50,
    symbols: [],
    themes: [],
    characters: [],
    setting: [],
    notes_to_ai: "",
    real_life_link: "",
  });

  const currentStepData = steps.find((step) => step.id === currentStep);

  // Validation functions
  const validateField = (field, value) => {
    trackEvent("Validation Failed", { source: "Dream Form", field });
    switch (field) {
      case "title":
        if (!value || value.trim().length === 0) {
          return "Title is required";
        }
        if (value.trim().length < 3) {
          return "Title must be at least 3 characters";
        }
        return null;

      case "description":
        if (!value || value.trim().length === 0) {
          return "Description is required";
        }
        if (value.trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        return null;

      case "date":
        if (!value) {
          return "Date is required";
        }
        return null;

      case "mood":
        if (!value) {
          return "Please select a mood";
        }
        return null;

      case "intensity":
        if (value === undefined || value === null) {
          return "Please set intensity level";
        }
        return null;

      default:
        return null;
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Handle blur events for validation
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (currentStep <= 2) {
      const fieldsToValidate = currentStepData.fields;

      for (const field of fieldsToValidate) {
        const error = validateField(field, formData[field]);
        if (error) {
          return false;
        }
      }
      return true;
    }
    // Steps 3 and 4 are optional, always valid
    return true;
  };

  // Validate current step and show errors
  const validateCurrentStep = () => {
    if (currentStep <= 2) {
      const fieldsToValidate = currentStepData.fields;
      const newErrors = {};
      const newTouched = {};

      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        newTouched[field] = true;
      });

      setErrors((prev) => ({ ...prev, ...newErrors }));
      setTouched((prev) => ({ ...prev, ...newTouched }));

      return Object.values(newErrors).every((error) => !error);
    }
    return true;
  };

  const nextStep = () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async () => {
    // Final validation
    const isValid = validateCurrentStep();
    if (!isValid) return;

    setLoading(true);
    try {
      // Clean up empty arrays
      const cleanedData = {
        ...formData,
        symbols: formData.symbols?.filter(Boolean) || [],
        themes: formData.themes?.filter(Boolean) || [],
        characters: formData.characters?.filter(Boolean) || [],
        setting: formData.setting?.filter(Boolean) || [],
      };
      // Send data to the server
      await axiosPrivate.post("/dream", cleanedData);

      trackEvent("dream_create_completed");

      toast.success("Dream saved successfully! 🎉", {
        description: "You can view your dream in My Dreams section.",
      });
      handleClose();
    } catch (error) {
      console.error("Error saving dream:", error);
      toast.error("Failed to save dream. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const TagInput = ({
    value = [],
    onChange,
    placeholder,
    suggestions = [],
  }) => {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addTag = (tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !value.includes(trimmedTag)) {
        onChange([...value, trimmedTag]);
        setInputValue("");
        setShowSuggestions(false);
      }
    };

    const removeTag = (tagToRemove) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      }
    };

    const filteredSuggestions = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
    );

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  onClick={() => addTag(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <Badge key={index} className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Type and press Enter or comma to add. You can add your own or select
          from suggestions.
        </p>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>What would you call this dream? *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="e.g., The Flying Adventure, The Mysterious Forest..."
              />
              {touched.title && errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label>Describe your dream in detail *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                onBlur={() => handleBlur("description")}
                placeholder="Write everything you remember - the more detail, the better we can help you understand it..."
                rows={4}
              />
              {touched.description && errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label>When did you have this dream? *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                onBlur={() => handleBlur("date")}
                max={today}
              />
              {touched.date && errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>How did this dream make you feel? *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => {
                      handleInputChange("mood", mood.label);
                      handleBlur("mood");
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.mood === mood.label
                        ? `${mood.color} border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800`
                        : `${mood.color} border-transparent hover:border-gray-300 dark:hover:border-gray-600`
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              {touched.mood && errors.mood && (
                <p className="text-red-500 text-sm mt-1">{errors.mood}</p>
              )}
            </div>

            <div>
              <Label>How intense was this feeling? *</Label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.intensity}
                    onChange={(e) => {
                      handleInputChange("intensity", parseInt(e.target.value));
                      handleBlur("intensity");
                    }}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${formData.intensity}%, #e5e7eb ${formData.intensity}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Barely noticeable</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {formData.intensity}%
                    </span>
                    <span>Overwhelming</span>
                  </div>
                </div>
              </div>
              {touched.intensity && errors.intensity && (
                <p className="text-red-500 text-sm mt-1">{errors.intensity}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
              <p>
                These fields are optional but help us provide better insights.
              </p>
              <p className="text-sm">
                You can type your own or select from suggestions.
              </p>
            </div>

            <div>
              <Label>Symbols that appeared</Label>
              <TagInput
                value={formData.symbols}
                onChange={(value) => handleInputChange("symbols", value)}
                placeholder="e.g., water, fire, animals, keys..."
                suggestions={[
                  "water",
                  "fire",
                  "animals",
                  "keys",
                  "doors",
                  "mirrors",
                  "stairs",
                  "money",
                  "car",
                  "house",
                ]}
              />
            </div>

            <div>
              <Label>Themes or topics</Label>
              <TagInput
                value={formData.themes}
                onChange={(value) => handleInputChange("themes", value)}
                placeholder="e.g., adventure, fear, love, success..."
                suggestions={[
                  "adventure",
                  "fear",
                  "love",
                  "success",
                  "failure",
                  "death",
                  "rebirth",
                  "journey",
                  "conflict",
                  "reunion",
                ]}
              />
            </div>

            <div>
              <Label>Characters who appeared</Label>
              <TagInput
                value={formData.characters}
                onChange={(value) => handleInputChange("characters", value)}
                placeholder="e.g., family member, stranger, celebrity..."
                suggestions={[
                  "family member",
                  "friend",
                  "stranger",
                  "celebrity",
                  "deceased person",
                  "childhood friend",
                  "coworker",
                  "teacher",
                ]}
              />
            </div>

            <div>
              <Label>Setting or location</Label>
              <TagInput
                value={formData.setting}
                onChange={(value) => handleInputChange("setting", value)}
                placeholder="e.g., childhood home, school, unknown place..."
                suggestions={[
                  "childhood home",
                  "school",
                  "workplace",
                  "unknown place",
                  "nature",
                  "city",
                  "ocean",
                  "mountains",
                  "space",
                ]}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
              <p>
                These optional details can help provide more personalized
                insights.
              </p>
            </div>

            <div>
              <Label>Notes for AI analysis</Label>
              <Textarea
                value={formData.notes_to_ai}
                onChange={(e) =>
                  handleInputChange("notes_to_ai", e.target.value)
                }
                placeholder="Any additional context, emotions, or thoughts you want the AI to consider while analyzing your dream..."
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                e.g., "I was stressed about work before sleeping" or "This dream
                felt very vivid"
              </p>
            </div>

            <div>
              <Label>Connection to real life</Label>
              <Textarea
                value={formData.real_life_link}
                onChange={(e) =>
                  handleInputChange("real_life_link", e.target.value)
                }
                placeholder="Did anything from your day or recent experiences trigger this dream?"
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                e.g., "Had a job interview yesterday" or "Watched a scary movie"
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Check if Next button should be disabled
  const isNextDisabled = !isStepValid();

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Moon className="w-6 h-6" />
                Dream Journal
              </h2>
              <p className="text-purple-100 mt-1">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <button
              onClick={() => {
                trackEvent("dream_create_abandoned");
                handleClose();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-100">
                {currentStepData.title}
              </span>
              <span className="text-sm text-purple-100">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <currentStepData.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    step.id === currentStep
                      ? "bg-purple-600 dark:bg-purple-400"
                      : step.id < currentStep || completedSteps.has(step.id)
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div key={currentStep}>{renderStepContent()}</div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save Dream
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
                disabled={isNextDisabled}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
