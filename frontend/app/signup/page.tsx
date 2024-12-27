// signup/page.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../components/AuthForm";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const handleSignup = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      alert("Signup successful. Please login.");
      router.push("/login");
    } catch (err) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div>
      <AuthForm title="Signup" buttonText="Signup" onSubmit={handleSignup} />
      <br />
      <Link href="/login">Login</Link>
    </div>
  );
}
