"use client";

import { useState, useEffect } from "react";
import AnimatedHeader from "./components/AnimatedHeader";

// Subject logos component
const SubjectLogo = ({ subject }) => {
  switch (subject) {
    case "math":
      return <div className="logo math">+</div>;
    case "science":
      return (
        <div className="logo science">
          <div className="atom-center"></div>
          <div className="orbit orbit1"></div>
          <div className="orbit orbit2"></div>
        </div>
      );
    case "english":
      return <div className="logo english">ABC</div>;
    case "history":
      return <div className="logo history"><div className="page"></div></div>;
    case "cs":
      return <div className="logo cs">&lt;&gt;</div>;
    default:
      return <div className="logo">?</div>;
  }
};

const SUBJECTS = ["math", "science", "english", "history", "cs"];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [grade, setGrade] = useState(6);
  const [subject, setSubject] = useState("math");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [visibleAnswer, setVisibleAnswer] = useState("");
  const [gradeBarOpen, setGradeBarOpen] = useState(false);

  // Star particles
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.1 + 0.05,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((s) => ({ ...s, y: s.y + s.speed > 100 ? 0 : s.y + s.speed }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, [stars]);

  // AI answer animation
  const animateAnswerLoop = (text) => {
    const words = text.split(/\s+/);
    let i = 0;
    let removing = false;

    const step = () => {
      if (!removing) {
        setVisibleAnswer((prev) =>
          prev ? prev + " " + words[i] : words[i]
        );
        i++;
        if (i >= words.length) {
          removing = true;
          setTimeout(step, 800);
        } else {
          setTimeout(step, 150);
        }
      } else {
        setVisibleAnswer((prev) => {
          const newText = prev.split(" ").slice(0, -1).join(" ");
          return newText;
        });
        i--;
        if (i <= 0) removing = false;
        setTimeout(step, 150);
      }
    };

    step();
  };

  const askAI = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setAnswer("");
    setVisibleAnswer("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, grade, subject }),
      });
      const j = await res.json();
      const ans = j.answer || "No answer found.";
      setAnswer(ans);
      animateAnswerLoop(ans);
    } catch (err) {
      console.error(err);
      setVisibleAnswer("Error: cannot get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Starry Background */}
      <div className="stars">
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
      </div>

      <header>
        <AnimatedHeader />
        <p>Homework Helper — concise AI answers</p>
      </header>

      <main>
        <div className="subjects">
          {SUBJECTS.map((s) => (
            <div
              key={s}
              onClick={() => setSubject(s)}
              className={subject === s ? "active" : ""}
            >
              <SubjectLogo subject={s} />
            </div>
          ))}
        </div>

        <textarea
          rows={4}
          maxLength={800}
          placeholder="Enter your homework question"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="controls">
          <div className="grade-selector">
            <button onClick={() => setGradeBarOpen((v) => !v)}>
              🎛 Grade: {grade}
            </button>
            {gradeBarOpen && (
              <input
                type="range"
                min="1"
                max="10"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
              />
            )}
          </div>
          <button onClick={askAI} disabled={loading}>
            {loading ? "Asking..." : "Ask AI"}
          </button>
        </div>

        {answer && (
          <div className="answer-box">
            <span>{visibleAnswer}</span>
            <span className="caret">▌</span>
          </div>
        )}
      </main>

      <footer>
        Made with <span className="love">❤</span> by Ishfaq · Asim · Talha
      </footer>

      <style jsx>{`
        .container {
          padding: 24px;
          max-width: 900px;
          margin: auto;
          min-height: 100vh;
          color: #e6eef8;
          font-family: Inter, system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: radial-gradient(circle, rgba(10,10,25,1) 0%, rgba(0,0,10,1) 100%);
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.8;
        }

        header {
          text-align: center;
          margin-bottom: 24px;
        }

        header p {
          color: #94a3b8;
        }

        .subjects {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .subjects div {
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s;
        }

        .subjects div.active {
          opacity: 1;
          transform: scale(1.1);
        }

        textarea {
          width: 100%;
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          color: #e6eef8;
          resize: none;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .grade-selector button {
          padding: 8px 12px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: #e6eef8;
          cursor: pointer;
        }

        .grade-selector input[type="range"] {
          width: 120px;
          margin-top: 6px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .answer-box {
          margin-top: 18px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .caret {
          animation: blink 800ms steps(2) infinite;
          margin-left: 4px;
        }

        footer {
          text-align: center;
          margin-top: 36px;
          color: #94a3b8;
          font-size: 14px;
        }

        .love {
          display: inline-block;
          color: #ff5c7c;
          animation: love 1.2s infinite;
        }

        @keyframes blink {50% { opacity: 0; }}
        @keyframes love {0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}

        /* Subject Logo animations */
        .logo {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border-radius: 50%;
          border: 2px solid #7c3aed;
          position: relative;
          color: #fff;
        }

        .logo.math span {font-size:24px;animation: rotateMath 2s linear infinite;}
        @keyframes rotateMath {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        .logo.science .orbit {position:absolute;width:8px;height:8px;background:#22d3ee;border-radius:50%;top:50%;left:50%;transform-origin:-14px center;}
        .logo.science .orbit1 {animation: orbit1 2s linear infinite;}
        .logo.science .orbit2 {animation: orbit2 2.5s linear infinite;}
        @keyframes orbit1 {0%{transform:rotate(0deg) translateX(14px) rotate(0deg);}100%{transform:rotate(360deg) translateX(14px) rotate(-360deg);}}
        @keyframes orbit2 {0%{transform:rotate(0deg) translateX(10px) rotate(0deg);}100%{transform:rotate(360deg) translateX(10px) rotate(-360deg);}}
        .logo.science .atom-center {width:10px;height:10px;background:#22d3ee;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
        .logo.english {animation: pulseABC 1.5s infinite;}
        @keyframes pulseABC {0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        .logo.history .page {width:6px;height:12px;background:#facc15;animation:flipBook 1s infinite;}
        @keyframes flipBook {0%,100%{transform:rotateY(0deg);}50%{transform:rotateY(180deg);}}
        .logo.cs {animation: spinCS 1.5s linear infinite;}
        @keyframes spinCS {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
      `}</style>
    </div>
  );
  }
