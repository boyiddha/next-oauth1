"use client";

import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/");
      toast.success("login successful");
    } else if (res.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
      setPending(false);
    }
  };

  const handleProvider = (e, value) => {
    e.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };

  return (
    <div>
      <h2>Sign-In Page </h2>
      <hr />
      {error && <p style={{ color: "red", fontSize: "25px" }}>{error}</p>}
      <hr /> <br />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          disabled={pending}
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="password"
          disabled={pending}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />
        <button disabled={pending}> continue</button>
      </form>
      <hr /> <hr />
      <button
        disabled={false}
        style={{ margin: "15px" }}
        onClick={(e) => handleProvider(e, "google")}
      >
        {" "}
        <FcGoogle style={{ fontSize: "50px", margin: "7px" }} />{" "}
      </button>
      <button
        disabled={false}
        style={{ margin: "15px" }}
        onClick={(e) => handleProvider(e, "github")}
      >
        {" "}
        <FaGithub style={{ fontSize: "50px", margin: "5px" }} />{" "}
      </button>
      <p>
        Create a new Account
        <Link
          href="sign-up"
          style={{ marginLeft: "10px", color: "blue", fontWeight: "bold" }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
