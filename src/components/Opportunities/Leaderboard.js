import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const currentEvent = {
    name: "AI Model Sprint 2025",
    date: "November 01, 2025",
    participants: [
      { rank: 1, name: "Aarav Gupta", score: 98 },
      { rank: 2, name: "Priya Sharma", score: 95 },
      { rank: 3, name: "Rahul Mehta", score: 93 },
      { rank: 4, name: "Ananya Verma", score: 90 },
      { rank: 5, name: "Devansh Patel", score: 88 },
      { rank: 6, name: "Arjun Singh", score: 85 },
      { rank: 7, name: "Sneha Kapoor", score: 82 },
      { rank: 8, name: "Vikram Das", score: 80 },
    ],
  };

  const pastEvents = [
    {
      name: "Neural Hackathon 2.0",
      winners: [
        { rank: 1, name: "Ishaan Jain" },
        { rank: 2, name: "Riya Singh" },
        { rank: 3, name: "Manas Tiwari" },
      ],
    },
    {
      name: "AI Model Sprint 2024",
      winners: [
        { rank: 1, name: "Kunal Yadav" },
        { rank: 2, name: "Sneha Gupta" },
        { rank: 3, name: "Vikram Das" },
      ],
    },
    {
      name: "VisionX Challenge 2024",
      winners: [
        { rank: 1, name: "Aditya Rao" },
        { rank: 2, name: "Tanya Bose" },
        { rank: 3, name: "Rohan Malhotra" },
      ],
    },
  ];

  const carouselRef = useRef(null);

  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="leaderboard-section" id="leaderboard">
      {/* ===== HEADER ===== */}
      <motion.div
        className="leaderboard-hero"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>🏆 Leaderboard</h1>
        <p>Celebrating excellence across our AI & ML events</p>
      </motion.div>

      {/* ===== CURRENT EVENT ===== */}
      <motion.div
        className="current-leaderboard"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="event-header">
          <h2>{currentEvent.name}</h2>
          <p>{currentEvent.date}</p>
        </div>

        {/* PODIUM */}
        <div className="podium">
          {currentEvent.participants.slice(0, 3).map((p, i) => {
            const icons = [Trophy, Medal, Award];
            const Icon = icons[i];
            const colors = ["gold", "silver", "bronze"];
            const classes = ["first", "second", "third"];
            return (
              <motion.div
                key={p.rank}
                className={`podium-card ${classes[i]}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <Icon className={`podium-icon ${colors[i]}`} />
                <h3>{p.name}</h3>
                <p>{p.score} pts</p>
                <span className="rank-badge">#{p.rank}</span>
              </motion.div>
            );
          })}
        </div>

        {/* TABLE */}
        <div className="table">
          <div className="table-header">
            <span>Rank</span>
            <span>Name</span>
            <span>Score</span>
          </div>
          {currentEvent.participants.map((p, i) => (
            <motion.div
              key={p.rank}
              className={`table-row ${i % 2 ? "odd" : ""}`}
              whileHover={{ backgroundColor: "rgba(0,234,255,0.06)" }}
            >
              <span className="rank">#{p.rank}</span>
              <span>{p.name}</span>
              <span className="score">{p.score}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== PAST EVENTS ===== */}
      <motion.div
        className="past-events"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2>Past Event Winners</h2>
        <div className="carousel-wrapper">
          <button className="scroll-btn left" onClick={() => scrollCarousel("left")}>
            <ChevronLeft size={22} />
          </button>
          <div className="carousel" ref={carouselRef}>
            {pastEvents.map((ev, i) => (
              <motion.div
                key={i}
                className="past-card"
                whileHover={{ y: -6, boxShadow: "0 0 25px rgba(0,255,255,0.25)" }}
              >
                <h3>{ev.name}</h3>
                <ul>
                  {ev.winners.map((w) => (
                    <li key={w.rank}>
                      <span>#{w.rank}</span> {w.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scrollCarousel("right")}>
            <ChevronRight size={22} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Leaderboard;
