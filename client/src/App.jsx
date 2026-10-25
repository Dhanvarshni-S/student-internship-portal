import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

import { useState } from "react";
import "./App.css";

const internships = [
  {
    id: "1",
    title: "React Developer Intern",
    company: "Tech Solutions",
    duration: "3 months",
    description: "Develop responsive user interfaces using React.",
    skills: "React, JavaScript, HTML and CSS"
  },
  {
    id: "2",
    title: "Node.js Developer Intern",
    company: "Code Labs",
    duration: "4 months",
    description: "Build backend applications and REST APIs.",
    skills: "Node.js, Express and MongoDB"
  },
  {
    id: "3",
    title: "Full Stack Developer Intern",
    company: "Digital Works",
    duration: "6 months",
    description: "Develop complete web applications.",
    skills: "React, Node.js, Express and MongoDB"
  }
];

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
function InternshipList() {
  return (
    <div>
      <h2>Available Internships</h2>

      {internships.map((item) => (
        <div className="card" key={item.id}>
          <h3>{item.title}</h3>
          <p><strong>Company:</strong> {item.company}</p>
          <p><strong>Duration:</strong> {item.duration}</p>

          <Link to={`/internship/${item.id}`} className="link-button">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

function InternshipDetails() {
  const { id } = useParams();

  const item = internships.find((i) => i.id === id);

  if (!item) {
    return <h2>Internship not found</h2>;
  }

  return (
    <div className="card">
      <h2>{item.title}</h2>
      <p><strong>Company:</strong> {item.company}</p>
      <p><strong>Duration:</strong> {item.duration}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Required Skills:</strong> {item.skills}</p>

      <Link to={`/apply/${item.id}`} className="link-button">
        Apply Now
      </Link>

      <p>
        <Link to="/">Back to Internships</Link>
      </p>
    </div>
  );
}

function ApplicationForm() {
  const { id } = useParams();

  const item = internships.find((i) => i.id === id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    internship: item ? item.title : ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!item) {
    return <h2>Internship not found</h2>;
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.rollNumber.trim()
    ) {
      setError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setError(false);
      setMessage("Application submitted successfully!");

      setForm({
        name: "",
        email: "",
        rollNumber: "",
        internship: item.title
      });
    } catch (err) {
      setError(true);
      setMessage(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Internship Application Form</h2>
      <p>Applying for: <strong>{item.title}</strong></p>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label>Email ID</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Roll Number</label>
        <input
          name="rollNumber"
          value={form.rollNumber}
          onChange={handleChange}
          placeholder="Enter your roll number"
          required
        />

        <label>Selected Internship</label>
        <input value={form.internship} readOnly />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && (
        <p className={error ? "error" : "success"}>
          {message}
        </p>
      )}

      <p>
        <Link to={`/internship/${item.id}`}>Back to Details</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>Student Internship Portal</h1>
          <p>Find your next opportunity!</p>
          <Link to="/">Home</Link>
        </header>

        <Routes>
          <Route path="/" element={<InternshipList />} />
          <Route
            path="/internship/:id"
            element={<InternshipDetails />}
          />
          <Route
            path="/apply/:id"
            element={<ApplicationForm />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;