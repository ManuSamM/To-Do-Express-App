// login/page.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../components/AuthForm";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      router.push("/");
    } catch (err) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div>
      <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} />
      <br />
      <Link href="/signup">Sign Up</Link>
    </div>
  );
}
