"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gloading, setGLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/"); // Redirect to home if already logged in
    }
  }, [router]);

  // Basic email and password validation
  const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6; // Password should be at least 6 characters

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      router.push("/"); // Redirect to home upon successful login
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific error cases from Firebase
        if (err.name === "EmailNotVerifiedError") {
          setError("Please verify your email address before logging in.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGLoading(true);

    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home page after Google login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                  aria-describedby="email-helper-text"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
              </div>
            </div>
            <div className="flex flex-col pt-5 pb-5">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                aria-live="polite"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              {error && (
                <p className="text-red-500 pt-2" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
          </form>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 shadow-sm hover:bg-gray-100 dark:hover:text-black transition disabled:opacity-50"
            variant="outline"
            disabled={gloading}
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span>
              {gloading ? "Logging in with Google..." : "Continue with Google"}
            </span>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center">
            Forgot your password?{" "}
            <Link href="/password-reset" className="underline">
              Reset it here
            </Link>
          </p>
        </CardFooter>
      </Card>
      <p className="pt-4">
        New to x?{" "}
        <Link href="/signup" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
