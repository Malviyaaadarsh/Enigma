// src/components/Admin/AdminProblemCreator.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, Auth } from "../Firebase/Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const AdminProblemCreator = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [qText, setQText] = useState("");
  const [optionsText, setOptionsText] = useState(""); // comma separated
  const [answerIndex, setAnswerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(Auth, u => {
      if (!u) navigate("/login");
      setUser(u);
    });
    return () => unsub();
  }, [navigate]);

  const addQuestion = () => {
    const opts = optionsText.split(",").map(s => s.trim()).filter(Boolean);
    if (!qText || opts.length < 2) {
      toast.warn("Provide question and at least 2 comma-separated options");
      return;
    }
    const q = {
      id: `${Date.now()}${Math.floor(Math.random()*99)}`,
      q: qText,
      options: opts.map((t,i) => ({ id: `o${i+1}`, text: t })),
      answerId: `o${answerIndex+1}`
    };
    setQuizQuestions(prev => [...prev, q]);
    setQText(""); setOptionsText(""); setAnswerIndex(0);
  };

  const createProblemAndQuiz = async () => {
    try {
      let quizId = null;
      if (quizQuestions.length > 0) {
        const quizRef = await addDoc(collection(db, "quizzes"), {
          title: `${title} — Quiz`,
          questions: quizQuestions,
          createdAt: serverTimestamp()
        });
        quizId = quizRef.id;
      }

      await addDoc(collection(db, "problems"), {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        active: true,
        quizId,
        createdAt: serverTimestamp()
      });

      toast.success("Problem (and quiz) created");
      setTitle(""); setDescription(""); setDeadline(""); setQuizQuestions([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create problem");
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Create Problem (Admin)</h2>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="datetime-local" value={deadline} onChange={e=>setDeadline(e.target.value)} />
      <hr />
      <h3>Quiz (optional)</h3>
      <input placeholder="Question text" value={qText} onChange={e=>setQText(e.target.value)} />
      <input placeholder="Options (comma separated)" value={optionsText} onChange={e=>setOptionsText(e.target.value)} />
      <label>Correct option index (0-based)</label>
      <input type="number" value={answerIndex} min={0} onChange={e=>setAnswerIndex(Number(e.target.value))} />
      <button onClick={addQuestion}>Add Question</button>

      <ul>
        {quizQuestions.map(q => <li key={q.id}>{q.q} — {q.options.map(o=>o.text).join(", ")}</li>)}
      </ul>

      <div style={{ marginTop: 12 }}>
        <button onClick={createProblemAndQuiz}>Create Problem & Quiz</button>
      </div>
    </div>
  );
};

export default AdminProblemCreator;
