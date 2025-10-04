// src/components/SignUp/SignUpPage.js
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import "../SignUp/Signup.css";
import Logo from "../../Assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { Auth, db } from "../Firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const [userType, setUserType] = useState("member");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    college: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mapFirebaseError = (error) => {
    const code = error?.code || "";
    if (code.includes("email-already-in-use")) return "This email is already registered. Please log in.";
    if (code.includes("invalid-email")) return "Please enter a valid email address.";
    if (code.includes("weak-password")) return "Password is too weak. Use at least 6 characters.";
    if (code.includes("network-request-failed")) return "Network error. Check your connection.";
    return error?.message || "Something went wrong. Try again.";
  };

  const basicValidation = ({ name, email, password, confirmPassword }) => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    // quick email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter a password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, name, phone, college } = formData;
    const validationError = basicValidation({ name, email, password, confirmPassword });
    if (validationError) {
      toast.warn(validationError, { position: "bottom-right" });
      return;
    }

    setLoading(true);
    try {
      // 1) Check if email already has sign-in methods (pre-check)
      const methods = await fetchSignInMethodsForEmail(Auth, email.trim());
      if (methods && methods.length > 0) {
        // Email exists (could be registered via password or other provider)
        toast.error("This email is already registered. Please log in or use a different email.", {
          position: "bottom-right",
        });
        setLoading(false);
        return;
      }

      // 2) Create user
      const userCredential = await createUserWithEmailAndPassword(Auth, email.trim(), password);
      const user = userCredential.user;

      // 3) set displayName
      try {
        await updateProfile(user, { displayName: name.trim() });
      } catch (updErr) {
        console.warn("updateProfile failed:", updErr);
        // not fatal — continue
      }

      // 4) Write user doc to Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          Name: name.trim(),
          Email: email.trim(),
          Phone: phone.trim(),
          College: college.trim(),
          UserType: userType,
          UID: user.uid,
          createdAt: new Date().toISOString(),
        });
      } catch (fireErr) {
        // If Firestore write fails, you might want to handle cleanup (optional).
        console.error("Firestore write failed:", fireErr);
        toast.warn("Account created but we couldn't save profile details. Try again later.", {
          position: "bottom-right",
        });
        // still navigate or ask user to retry; here we'll continue to navigate
      }

      toast.success("User Registered Successfully!", {
        className: "signup-custom-toast",
        position: "bottom-right",
      });

      navigate("/login");
    } catch (error) {
      const message = mapFirebaseError(error);
      toast.error(message, { position: "bottom-right" });
      console.error("Error during sign up:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="form-container">
      <div className="form-01">
        <div className="background">
          <div className="signup-shape"></div>
          <div className="signup-shape"></div>
        </div>

        <form className="signup-form" onSubmit={handleSignUpSubmit}>
          <div className="logo-container">
            <img src={Logo} alt="App Logo" className="signup-app-logo" />
            <h3>SignUp Here</h3>

            <div className="login-toggle">
              <div
                className={`toggle-button go ${userType === "member" ? "active" : ""}`}
                onClick={() => setUserType("member")}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                <i className={`fa-solid fa-star ${userType === "member" ? "active" : ""}`}></i> Member
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div
                className={`toggle-button fb ${userType === "student" ? "active" : ""}`}
                onClick={() => setUserType("student")}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                <i className={`fa-solid fa-graduation-cap ${userType === "student" ? "active" : ""}`}></i> Student
              </div>
            </div>

            <input
              type="text"
              placeholder="Name"
              className="input-field"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="text"
              placeholder="College Name"
              className="input-field"
              name="college"
              value={formData.college}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              className="input-field"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <button type="submit" disabled={loading} className="signup-submit">
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="login-link">
              <p>
                Already have an Account? &nbsp;
                <div className="LogIn" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                  Log In
                </div>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
