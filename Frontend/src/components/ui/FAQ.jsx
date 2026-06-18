import React, { useEffect, useState } from "react";
import "./FAQ.scss";

const faqs = [
  {
    question: "How does the AI interview strategy work?",
    answer: "Our AI analyzes your uploaded resume alongside the specific job description you provide. It identifies skill gaps, predicts likely questions, and builds a customized preparation plan to help you stand out.",
    meta: "Strategy",
  },
  {
    question: "Can I practice for specific technical roles?",
    answer: "Yes. Whether it's Software Engineering, Product Management, or Marketing, the AI interviewer adapts its questions to match the seniority and domain of the target role perfectly.",
    meta: "Mock Interviews",
  },
  {
    question: "How accurate is the resume matching score?",
    answer: "The match score uses advanced NLP to compare your experience against the job requirements, mirroring how actual Applicant Tracking Systems (ATS) filter candidates.",
    meta: "Analysis",
  },
  {
    question: "What kind of feedback do I get after a mock interview?",
    answer: "You receive comprehensive feedback on your communication clarity, confidence, and the technical depth of your answers, along with actionable suggestions for improvement before the real thing.",
    meta: "Feedback",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const toggleQuestion = (index) => setActiveIndex((prev) => (prev === index ? -1 : index));

  useEffect(() => {
    let timeout;
    const onLoad = () => {
      timeout = window.setTimeout(() => setHasEntered(true), 120);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timeout);
    };
  }, []);

  const setCardGlow = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
  };

  const clearCardGlow = (event) => {
    const target = event.currentTarget;
    target.style.removeProperty("--faq-x");
    target.style.removeProperty("--faq-y");
  };

  return (
    <section
      className={`faq-section ${hasEntered ? "faq-fade-ready" : "faq-fade"}`}
      aria-label="Frequently Asked Questions"
    >
      <div className="faq-inner">
        <div className={`faq-intro ${hasEntered ? "faq-intro-active" : ""}`}>
          <span className="faq-intro-beam" aria-hidden="true" />
          <span className="faq-intro-pulse" aria-hidden="true" />
          <span className="faq-intro-label">SIGNAL FAQ</span>
          <span className="faq-intro-meter" aria-hidden="true" />
          <span className="faq-intro-tick" aria-hidden="true" />
        </div>

        <header className="faq-header">
          <h2 className="section-title">Focus on the signal, not the noise.</h2>
          <p className="section-subtitle">
            Everything you need to know about preparing with Nexviva Ai, condensed into calm clarity.
          </p>
        </header>

        <ul className="faq-list">
          {faqs.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-trigger-${index}`;

            return (
              <li
                key={item.question}
                className="faq-item group"
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`faq-glow ${open ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  className="faq-trigger"
                >
                  <span className="faq-icon-wrapper">
                    <span className={`faq-icon-ring ${open ? "animate-ping" : ""}`} />
                    <svg
                      className={`faq-icon ${open ? "rotate-45" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>

                  <div className="faq-content">
                    <div className="faq-question-row">
                      <h3 className="faq-question">{item.question}</h3>
                      {item.meta && <span className="faq-meta">{item.meta}</span>}
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`faq-panel ${open ? "open" : ""}`}
                    >
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
