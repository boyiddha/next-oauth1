"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      router.push("/sign-in");
    } else {
      setError(data.message);
      setPending(false);
    }
  };
  return (
    <div>
      <h2>Sign-Up Page </h2>
      <hr />
      {error && <p style={{ color: "red", fontSize: "25px" }}>{error}</p>}
      <hr /> <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          disabled={pending}
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />
        <br />
        <input
          type="email"
          disabled={pending}
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />
        <br />
        <input
          type="password"
          disabled={pending}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />
        <br />
        <input
          type="password"
          disabled={pending}
          placeholder="confirm password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
        />
        <br />
        <br />
        <button disabled={pending}> continue</button>
      </form>
      <hr /> <hr />
      <button disabled={false} style={{ margin: "15px" }} onClick={() => {}}>
        {" "}
        <FcGoogle style={{ fontSize: "50px", margin: "7px" }} />{" "}
      </button>
      <button disabled={false} style={{ margin: "15px" }} onClick={() => {}}>
        {" "}
        <FaGithub style={{ fontSize: "50px", margin: "5px" }} />{" "}
      </button>
      <p>
        Already have an account?
        <Link
          href="sign-in"
          style={{ marginLeft: "10px", color: "blue", fontWeight: "bold" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
