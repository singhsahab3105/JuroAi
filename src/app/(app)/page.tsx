"use client";

import Chat from "@/components/Chat";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECE6EE] dark:bg-[#1c1d1f]">
      <Navbar />
      <main className="flex flex-col flex-grow items-center justify-center px-6 py-12 text-center">
        <h1 className="text-4xl font-semibold text-[#000000] dark:text-white mb-4">
          Juro AI – Your Legal Assistant
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Ask legal questions and get AI-powered assistance instantly.
        </p>
        <div className="w-full max-w-2xl">
          <Chat/>
        </div>
      </main>
      <Footer />
    </div>
  );
}
