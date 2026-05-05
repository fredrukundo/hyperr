"use client";

import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-border bg-card text-foreground text-sm font-medium hover:border-[#2872A1] hover:text-[#2872A1] transition-all duration-200"
      >
        <Globe size={15} />
        <span>{currentLang?.code.toUpperCase()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-20 bg-card border-2 border-border rounded-xl shadow-xl overflow-hidden min-w-[130px]">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  language === lang.code
                    ? "bg-[#2872A1] text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span>{lang.code === "en" ? "🇬🇧" : "🇫🇷"}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}