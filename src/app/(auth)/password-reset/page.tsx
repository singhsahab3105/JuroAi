"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'error' or 'success'
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusType("");
    setLoading(true);

    try {
      const message = await resetPassword(email);
      setStatusMessage(message);
      setStatusType("success");
      setEmail(""); // Clear the email input after success
    } catch (err) {
      if (err instanceof Error) {
        setStatusMessage(err.message);
        setStatusType("error");
      } else {
        setStatusMessage("An unknown error occurred.");
        setStatusType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset}>
            <div className="grid w-full items-center gap-4">
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
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Password Reset Email"}
              </Button>
            </div>
          </form>
          <Link href="/login">
            <Button variant="outline" className="w-full mt-4">
              Go Back to Login
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {statusMessage && (
            <p className={`text-center ${statusType === "error" ? "text-red-500" : "text-green-600"}`}>
              {statusMessage}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordReset;
