// components/AuthForm.tsx

import React, { useState, FormEvent } from "react";

interface AuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (username: string, password: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  buttonText,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};
