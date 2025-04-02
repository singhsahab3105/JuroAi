"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); // Redirect to login after logout
    } catch (error) {
      console.error(error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <Button onClick={handleLogout} className="logout-button">
      Logout
    </Button>
  );
};

export default LogoutButton;
