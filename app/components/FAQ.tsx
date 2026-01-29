"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "So what is Ponderdome?",
    answer: "Ponderdome is the ultimate arena for your random thoughts, epiphanies, and shower musings. Share them, vote on others, and see who thinks alike.",
  },
  {
    question: "Do I have to be in the shower to post",
    answer: "No! While shower thoughts are encouraged, you can post from anywhere—the bus, your bed, or even while waiting for your coffee.",
  },
  {
    question: "Is it anonymous?",
    answer: "Yes, you can choose to post anonymously if you prefer to keep your genius (or weirdness) to yourself.",
  },
  {
    question: "Can I edit a thought after I post it?",
    answer: "Currently, thoughts cannot be edited once posted to preserve the integrity of the voting system. Proofread before you post!",
  },
  {
    question: "How does the Leaderboard work?",
    answer: "The leaderboard tracks the most popular thoughts based on upvotes. The more people vibe with your logic, the higher you climb.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center py-12 max-w-xl mx-auto px-4">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight font-sans">
          This might answer
          <br />
          your questions
        </h2>
        <p className="text-base text-muted-foreground">
          Some answers to common questions.
          <br />
          Not the one you're looking for? Ask here
        </p>
      </div>

      <div className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-sm md:text-base font-medium text-foreground">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
