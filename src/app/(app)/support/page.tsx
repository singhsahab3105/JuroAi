"use client"

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SupportPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4">
        <div className="flex flex-col justify-center items-center pt-16 px-4">
          <h1 className="text-3xl font-bold mb-6 text-center md:text-4xl lg:text-5xl">
            Support Center
          </h1>
          <p className="text-lg max-w-3xl text-center mb-6">
            Have questions or need assistance? We&apos;re here to help! Our support team is available to answer your queries and guide you through using our platform effectively.
          </p>

          <div className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-lg mb-4">
              You can reach our support team at the following contact methods:
            </p>
            <ul className="text-lg list-inside list-disc">
              <li>Email: support@kplatform.com</li>
              <li>Phone: +91 123 456 7890</li>
              <li>Live Chat: Available on the bottom right of the platform</li>
            </ul>
          </div>

          {/* Submit a Query - Card with default styling */}
          <div className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">Submit a Query</h2>
            <p className="text-lg mb-4">
              If you have a specific query or need further assistance, please use the form below to submit your request.
            </p>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Submit Your Query</h3>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-lg">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      className="p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-lg">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      className="p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="message" className="text-lg">Your Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter your message or query"
                    />
                  </div>

                  <Button type="submit" className="px-8 py-3 text-lg md:text-xl w-full">
                    Submit Query
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>


          <div className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQs)</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I get started with the platform?
                </AccordionTrigger>
                <AccordionContent>
                  Simply sign up and log in to explore our features, including stock scans, SIP, SWP calculators, and more!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How often is the stock data updated?
                </AccordionTrigger>
                <AccordionContent>
                  Stock data is updated daily to ensure you have the latest market information at your fingertips.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Can I get personalized support for my investments?
                </AccordionTrigger>
                <AccordionContent>
                  Currently, we offer general support for platform use, but our tools will help you make informed decisions based on real-time data and historical analysis.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What do I do if I face technical issues?
                </AccordionTrigger>
                <AccordionContent>
                  If you&apos;re experiencing any technical difficulties, you can contact us via email or live chat, and our team will assist you as soon as possible.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SupportPage;
