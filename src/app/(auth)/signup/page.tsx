"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [gloading, setGLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (auth.currentUser) {
            router.push("/"); // Redirect to home if already logged in
        }
    }, [router]);
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await signUp(email, password, name);
            setMessage(response.message || "Signup successful! Please verify your email.");
            router.push("/verify-email");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to sign up. Please try again.");
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        setGLoading(true);
        try {
            const result = await signInWithGoogle();
            console.log("Google signup successful:", result.user);
            setMessage("Google signup successful!");
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError("Failed to sign up with Google. Please try again.");
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setGLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col pt-5 pb-5">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing up..." : "Signup"}
                            </Button>
                            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
                            {message && <p className="text-green-500 text-sm pt-2">{message}</p>}
                        </div>
                    </form>
                    <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:hover:text-black rounded-md py-2 px-4 shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
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
                            {gloading ? "Signing up with Google..." : "Continue with Google"}
                        </span>
                    </Button>

                </CardContent>
                <CardFooter className="flex justify-center">
                    <p>
                        Already have an account?{" "}
                        <a href="/login" className="underline">
                            Login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
