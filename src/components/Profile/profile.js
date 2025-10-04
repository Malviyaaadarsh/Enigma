import React, { useEffect, useState, useRef } from "react";
import { Auth, db } from "../Firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DiamondHead from "../../Assets/DiamondHead.jpg";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ Name: "", Email: "", Phone: "", skills: [] });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);
  const [newSkill, setNewSkill] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch user data
  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserDetails(data);
        setForm({
          Name: data.Name || "",
          Email: data.Email || "",
          Phone: data.Phone || "",
          skills: data.skills || [],
        });
        setAvatarPreview(data.avatarDataUrl || DiamondHead);
      }
    } catch (err) {
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = Auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const user = Auth.currentUser;
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, form);
      setUserDetails({ ...userDetails, ...form });
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setForm((f) => ({ ...f, skills: [...f.skills, newSkill.trim()] }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const handleAvatarFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setAvatarPreview(dataUrl);
      try {
        const user = Auth.currentUser;
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { avatarDataUrl: dataUrl });
      } catch {}
    };
    reader.readAsDataURL(f);
  };

  const handleLogout = async () => {
    await Auth.signOut();
    setShowConfetti(true);
    setTimeout(() => navigate("/login"), 1000);
  };

  const profileCompletion = Math.min(
    100,
    ((form.Name ? 1 : 0) + (form.Email ? 1 : 0) + (form.Phone ? 1 : 0) + (form.skills.length ? 1 : 0)) * 25
  );

  return (
    <div className="profile-page">
      {showConfetti && (
        <div className="confetti-root" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <span className="confetti" key={i} style={{ left: `${i * 5}%`, animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div className="profile-card glass">
          {/* Avatar */}
          <div className="avatar-area">
            <img
              src={avatarPreview || DiamondHead}
              alt="avatar"
              className="profile-image"
              onClick={() => fileRef.current?.click()}
            />
            <input ref={fileRef} type="file" accept="image/*" className="hidden-file" onChange={handleAvatarFile} />
          </div>

          {/* Name + Welcome */}
          <h2 className="profile-name">{form.Name || "User"}</h2>
          <p className="welcome-msg">Welcome back, {form.Name || "User"}! 🙏</p>

          {/* Contact */}
          <div className="contact-info">
            <p>Email: <span>{form.Email || "—"}</span></p>
            <p>Contact: <span>{form.Phone || "—"}</span></p>
          </div>

          {/* Profile Progress */}
          <div className="profile-progress">
            <div className="progress-bar" style={{ width: `${profileCompletion}%` }} />
            <span>{profileCompletion}% Complete</span>
          </div>

          {/* Skills Section */}
          <div className="skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {form.skills.map((skill, idx) => (
                <span className="skill-badge" key={idx}>
                  {skill} <button onClick={() => handleRemoveSkill(skill)}>×</button>
                </span>
              ))}
            </div>
            <div className="skills-add">
              <input
                type="text"
                placeholder="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button onClick={handleAddSkill}>Add</button>
            </div>
          </div>

          {/* Actions */}
          <div className="action-bar">
            <button onClick={() => setEditing((s) => !s)}>{editing ? "Close Edit" : "Edit Profile"}</button>
            {editing && <button onClick={handleSave}>Save Changes</button>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
