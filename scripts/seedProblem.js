// scripts/seedProblem.js
// Node script (Firebase Admin) — run with: node scripts/seedProblem.js

const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

// Initialize app (only once)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = admin.firestore();

async function seed() {
  try {
    console.log("Seeding quiz...");

    // 1) create quiz
    const quizData = {
      title: "Fruit Classifier Quiz",
      questions: [
        {
          id: "q1",
          q: "Which ML task is image classification?",
          options: [
            { id: "o1", text: "Regression" },
            { id: "o2", text: "Classification" },
            { id: "o3", text: "Clustering" },
          ],
          answerId: "o2",
        },
        {
          id: "q2",
          q: "Which model is simplest for small image classification?",
          options: [
            { id: "o1", text: "Logistic Regression" },
            { id: "o2", text: "Large Transformer" },
            { id: "o3", text: "GAN" },
          ],
          answerId: "o1",
        },
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const quizRef = await db.collection("quizzes").add(quizData);
    console.log("Quiz created with id:", quizRef.id);

    // 2) create problem that references quiz
    console.log("Seeding problem...");
    const problemData = {
      title: "Image Classification Challenge #1",
      description:
        "Build a classifier to recognize 5 types of fruit. Use any model or pretrained backbone. Submit a link to your repo + brief README that explains your approach and dataset.",
      deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
      active: true,
      quizId: quizRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const problemRef = await db.collection("problems").add(problemData);
    console.log("Problem created with id:", problemRef.id);

    console.log("\n✅ Done. Created quiz & problem!");
    console.log("  Quiz ID:   ", quizRef.id);
    console.log("  Problem ID:", problemRef.id);
    console.log("\nOpen your Problem Hub page — it should now show the active problem.\n");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
