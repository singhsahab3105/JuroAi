"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { changePassword } from "@/lib/auth";
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation password do not match.");
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }
        try {
            await changePassword(currentPassword, newPassword);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <nav>
                <Navbar />
            </nav>
            <div className="change-password-container flex flex-col justify-center items-center h-screen">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        aria-label="Current Password"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        aria-label="New Password"
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
                                        aria-label="Confirm Password"
                                    />
                                </div>
                            </div>
                            {error && (
                                <p className="text-red-500 pt-2" aria-live="polite">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-green-500 pt-2" aria-live="polite">
                                    {success}
                                </p>
                            )}
                            <div className="flex flex-col pt-5">
                                <Button type="submit" className="w-full" disabled={loading} aria-live="polite">
                                    {loading ? "Changing Password..." : "Change Password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-center">
                            <Link href="/" className="underline">
                                Back to Home
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;
