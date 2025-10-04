// src/components/ProblemHub/ProblemHubPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, Auth } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import "../Discussion/Discussion.css"; // glassmorphism styles

const ProblemHubPage = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [activeProblem, setActiveProblem] = useState(null);
  const [previousProblems, setPreviousProblems] = useState([]);

  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [replyContents, setReplyContents] = useState({});

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const [activeTab, setActiveTab] = useState("problem");
  const [sortBy, setSortBy] = useState("latest"); // discussion sort
  const [searchQuery, setSearchQuery] = useState(""); // previous problems search

  const navigate = useNavigate();

  // --- Auth listener ---
  useEffect(() => {
    const unsub = onAuthStateChanged(Auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate("/login", { replace: true });
      setLoadingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  // --- Fetch problems ---
  useEffect(() => {
    const problemsQ = query(collection(db, "problems"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(problemsQ, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const active = list.find(p => p.active) || list[0] || null;
      setActiveProblem(active);
      setPreviousProblems(list.filter(p => p?.id !== active?.id));
    });
    return () => unsub();
  }, []);

  // --- Fetch threads for active problem ---
  useEffect(() => {
    if (!activeProblem) {
      setThreads([]);
      return;
    }
    const threadsQ = query(
      collection(db, "threads"),
      where("problemId", "==", activeProblem.id),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(threadsQ, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setThreads(list);
    });
    return () => unsub();
  }, [activeProblem]);

  // --- Load quiz ---
  useEffect(() => {
    setQuiz(null);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    if (!activeProblem?.quizId) return;
    const loadQuiz = async () => {
      const qRef = doc(db, "quizzes", activeProblem.quizId);
      const snap = await getDoc(qRef);
      if (snap.exists()) setQuiz({ id: snap.id, ...snap.data() });
    };
    loadQuiz();
  }, [activeProblem]);

  // --- Thread actions ---
  const createThread = async () => {
    if (!activeProblem) return toast.warn("No active problem selected.");
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast.warn("Enter title and content.");
      return;
    }
    try {
      await addDoc(collection(db, "threads"), {
        problemId: activeProblem.id,
        title: newThreadTitle.trim(),
        content: newThreadContent.trim(),
        createdAt: serverTimestamp(),
        user: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
          userType: user.userType || "member"
        },
        replies: [],
        likes: []
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      toast.success("Thread posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post thread");
    }
  };

  const postReply = async (threadId) => {
    const content = (replyContents[threadId] || "").trim();
    if (!content) return;
    try {
      const threadRef = doc(db, "threads", threadId);
      const thread = threads.find(t => t.id === threadId);
      const newReply = {
        id: `${Date.now()}`,
        content,
        createdAt: new Date(),
        user: { id: user.uid, name: user.displayName || "Anonymous", email: user.email },
        replies: []
      };
      await updateDoc(threadRef, {
        replies: [...(thread.replies || []), newReply]
      });
      setReplyContents(prev => ({ ...prev, [threadId]: "" }));
      toast.success("Reply posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post reply");
    }
  };

  const toggleLike = async (threadId) => {
    const threadRef = doc(db, "threads", threadId);
    const thread = threads.find(t => t.id === threadId);
    const likes = thread.likes || [];
    const userLiked = likes.includes(user.uid);
    const updatedLikes = userLiked ? likes.filter(id => id !== user.uid) : [...likes, user.uid];
    await updateDoc(threadRef, { likes: updatedLikes });
  };

  // --- Quiz actions ---
  const selectAnswer = (questionId, optionId) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] && answers[q.id] === q.answerId) correct++;
    });
    const total = quiz.questions.length;
    const score = Math.round((correct / Math.max(total,1)) * 100);
    setQuizSubmitted(true);
    setQuizResult({ correct, total, score });
    try {
      await addDoc(collection(db, "quizResults"), {
        quizId: quiz.id,
        problemId: activeProblem?.id || null,
        userId: user.uid,
        answers,
        correct,
        total,
        score,
        createdAt: serverTimestamp()
      });
      toast.success(`Quiz submitted — ${score}%`);
    } catch(err) {
      console.error(err);
      toast.warn("Quiz save failed.");
    }
  };

  // --- Helpers ---
  const formatTime = (t) => {
    if (!t) return "Just now";
    const date = t.toDate ? t.toDate() : t;
    const diff = (Date.now() - date.getTime()) / 1000;
    if(diff < 60) return "Just now";
    if(diff < 3600) return `${Math.floor(diff/60)} mins ago`;
    if(diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  const filteredPrevious = previousProblems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedThreads = [...threads].sort((a,b) => {
    if(sortBy==="mostReplied") return (b.replies?.length || 0) - (a.replies?.length || 0);
    return b.createdAt?.seconds - a.createdAt?.seconds;
  });

  if (loadingAuth) return <div className="loading">Checking auth...</div>;
  if (!user) return null;

  return (
    <div className="discussion-page">
      <h1>🧠 Problem Hub — Solve • Discuss • Quiz</h1>

      {/* Tabs */}
      <div className="tabs" style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {["problem","discussion","quiz","previous"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding:"8px 16px",
              borderRadius:8,
              border: activeTab===tab?"2px solid #0ff":"1px solid #ccc",
              background: activeTab===tab?"rgba(14, 245, 245, 0.1)":"transparent",
              cursor:"pointer",
              color:"white",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* --- Problem Section --- */}
      {activeTab==="problem" && (
        <section className="new-post" aria-live="polite">
          {activeProblem ? (
            <>
              <h2>{activeProblem.title}</h2>
              <p>{activeProblem.description}</p>
              {activeProblem.deadline && (
                <p style={{ fontSize:14, opacity:0.8 }}>
                  Deadline: {activeProblem.deadline.toDate ? activeProblem.deadline.toDate().toLocaleString() : activeProblem.deadline} 
                  ({Math.max(0, Math.ceil((activeProblem.deadline.toDate() - new Date())/(1000*60*60*24)))} days left)
                </p>
              )}
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <span className="tag">{activeProblem.difficulty||"Medium"}</span>
                <span className="tag">{threads.length} Discussions</span>
                {quiz && <span className="tag">Quiz Available</span>}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <button onClick={()=>navigate(`/submit-solution/${activeProblem.id}`)}>Submit Solution</button>
                <button onClick={()=>setActiveTab("previous")}>Previous Problems</button>
              </div>
            </>
          ) : <p>No active problem. Admins: add a problem in Firestore.</p>}
        </section>
      )}

      {/* --- Discussion Section --- */}
      {activeTab==="discussion" && (
        <section className="posts" style={{ width:"60%", margin:"0 auto 40px auto" }}>
          <h3>Discussion — {activeProblem?.title || "No problem selected"}</h3>
          <div className="sort-buttons">
            Sort by: 
            <button onClick={()=>setSortBy("latest")}>Latest</button>
            <button onClick={()=>setSortBy("mostReplied")}>Most Replied</button>
          </div>

          <div className="add-reply" style={{ margin:"12px 0" }}>
            <input placeholder="Thread title" value={newThreadTitle} onChange={e=>setNewThreadTitle(e.target.value)}/>
            <textarea placeholder="Describe your approach or question" value={newThreadContent} onChange={e=>setNewThreadContent(e.target.value)}/>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={createThread}>Post Thread</button>
              <button onClick={()=>{ setNewThreadTitle(""); setNewThreadContent(""); }}>Clear</button>
            </div>
          </div>

          {sortedThreads.length===0 ? <p>No threads yet!</p> : sortedThreads.map(thread=>(
            <div key={thread.id} className="thread-card">
              <div className="thread-header">
                <div className="user-avatar">{thread.user?.name?.[0]||"A"}</div>
                <div>
                  <h4>{thread.title}</h4>
                  <small>{thread.user?.name} • {formatTime(thread.createdAt)}</small>
                </div>
                <button onClick={()=>toggleLike(thread.id)}>👍 {thread.likes?.length||0}</button>
              </div>
              <p>{thread.content}</p>

              <div className="replies-section">
                {(thread.replies||[]).map(rep=>(
                  <div key={rep.id} className="reply-card">
                    <div className="reply-header">
                      <div className="reply-avatar">{rep.user?.name?.[0]||"U"}</div>
                      <div>
                        <div>{rep.user?.name}</div>
                        <small>{formatTime(rep.createdAt)}</small>
                      </div>
                    </div>
                    <p>{rep.content}</p>
                  </div>
                ))}
              </div>

              <div className="reply-input">
                <input placeholder="Write a reply..." value={replyContents[thread.id]||""} onChange={e=>setReplyContents(prev=>({...prev,[thread.id]:e.target.value}))}/>
                <button onClick={()=>postReply(thread.id)}>Reply</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* --- Quiz Section --- */}
      {activeTab==="quiz" && (
        <section className="posts" style={{ width:"60%", margin:"0 auto 40px auto" }}>
          <h3>Quick Quiz</h3>
          {!quiz ? <p>{activeProblem?.quizId ? "Loading quiz..." : "No quiz attached."}</p> :
          <div className="thread-card">
            <h4>{quiz.title}</h4>
            {quiz.questions.map((q,qi)=>(
              <div key={q.id} style={{ padding:12, borderRadius:8, background:"rgba(255,255,255,0.03)", marginBottom:10 }}>
                <div style={{ marginBottom:8, fontWeight:600 }}>{qi+1}. {q.q}</div>
                {q.options.map(opt=>{
                  const selected = answers[q.id]===opt.id;
                  const correct = quizSubmitted && q.answerId===opt.id;
                  const wrongSelected = quizSubmitted && selected && q.answerId!==opt.id;
                  return <button key={opt.id} onClick={()=>selectAnswer(q.id,opt.id)} disabled={quizSubmitted} style={{
                    textAlign:"left",
                    padding:"8px 12px",
                    borderRadius:8,
                    border:"1px solid rgba(255,255,255,0.12)",
                    background:selected?"rgba(0,240,255,0.12)":"transparent",
                    boxShadow: correct?"0 0 10px rgba(0,255,128,0.25)":(wrongSelected?"0 0 10px rgba(255,80,80,0.25)":"none"),
                    cursor:quizSubmitted?"default":"pointer",
                    color:"white",
                  }}>{opt.text}</button>
                })}
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={submitQuiz} disabled={quizSubmitted}>Submit Quiz</button>
              <button onClick={()=>{ setAnswers({}); setQuizSubmitted(false); setQuizResult(null); }}>Reset</button>
            </div>
            {quizResult && <div style={{ marginTop:12 }}>
              <strong>Score:</strong> {quizResult.score}% ({quizResult.correct}/{quizResult.total}) {quizResult.score<50?<span style={{color:"red"}}>Keep practicing!</span>:<span style={{color:"green"}}>Great job!</span>}
            </div>}
          </div>}
        </section>
      )}

      {/* --- Previous Problems --- */}
      {activeTab==="previous" && (
        <section style={{ width:"60%", margin:"0 auto 40px auto" }}>
          <h3>Previous Problems</h3>
          <input placeholder="Search previous problems..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{ marginBottom:12, width:"100%", padding:8, borderRadius:8 }}/>
          {filteredPrevious.length===0?<p>No previous problems.</p>:
          filteredPrevious.map(p=>(
            <div key={p.id} className="thread-card" style={{ marginBottom:10 }}>
              <h4>{p.title}</h4>
              <small>Posted {p.createdAt?.toDate? p.createdAt.toDate().toLocaleDateString():""}</small>
              <p>{p.description?.slice(0,200)}{p.description?.length>200?"...":""}</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{ setActiveProblem(p); setActiveTab("problem"); window.scrollTo({top:0, behavior:"smooth"}); }}>View</button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProblemHubPage;
