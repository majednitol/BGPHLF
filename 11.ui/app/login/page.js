'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Simulate login
    localStorage.setItem("ConnectedAccountUser", "user123");
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        Login
      </button>
    </div>
  );
}
