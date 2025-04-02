"use client"

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AboutUsPage() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen p-4">
                <div className="flex flex-col justify-center items-center pt-16 px-4">
                    <h1 className="text-4xl mb-6 text-center md:text-4xl lg:text-5xl">
                        Agreements
                    </h1>
                    
                </div>
                <div>
                    <Link href={"/agreements/nda"}><Button>NDA (Non Disclosure Agreement)</Button></Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUsPage;
