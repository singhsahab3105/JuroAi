"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyEmail = () => {
    const router = useRouter();
    useEffect(() => {
        if (auth.currentUser) {
          router.push("/"); // Redirect to home if already logged in
        }
      }, [router]);
    const handleGoToLogin = () => {
        router.push("/login");
    };

    return (
        <div>
            <Navbar/>
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Email Verification Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center">
                        A verification email has been sent to your registered email address. 
                        Please check your inbox (or spam folder) and verify your email before logging in.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleGoToLogin} className="w-full">
                        Go to Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
        </div>
    );
};

export default VerifyEmail;
