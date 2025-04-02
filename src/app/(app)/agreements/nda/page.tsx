"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { pdf, Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  body: { fontSize: 12, lineHeight: 1.5 },
});

type FormData = {
  effectiveDate: Date | undefined;
  party1Name: string;
  party1Business: string;
  party2Name: string;
  party2Business: string;
  purpose: string;
  confidentialityPeriod: string;
  governingLaw: string;
  courtJurisdiction: string;
  party1RepName: string;
  party1RepDesignation: string;
  party2RepName: string;
  party2RepDesignation: string;
};

const INITIAL_FORM_DATA: FormData = {
  effectiveDate: undefined,
  party1Name: "",
  party1Business: "",
  party2Name: "",
  party2Business: "",
  purpose: "",
  confidentialityPeriod: "",
  governingLaw: "",
  courtJurisdiction: "",
  party1RepName: "",
  party1RepDesignation: "",
  party2RepName: "",
  party2RepDesignation: "",
};

const NDAForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPersonalizedAgreement = async () => {
    setLoading(true);
    try {
      const prompt = `
        Generate a legally structured NDA with the following details:
        - Effective Date: ${formData.effectiveDate ? format(formData.effectiveDate, "PPP") : "Not specified"}
        - Party 1: ${formData.party1Name}, a company incorporated under the laws of India, located at ${formData.party1Business}
        - Party 2: ${formData.party2Name}, a company incorporated under the laws of India, located at ${formData.party2Business}
        - Purpose: ${formData.purpose}
        - Confidentiality Period: ${formData.confidentialityPeriod} years
        - Governing Law: ${formData.governingLaw}
        - Jurisdiction: ${formData.courtJurisdiction}
        - Signatories:
          - ${formData.party1RepName}, ${formData.party1RepDesignation} (Party 1)
          - ${formData.party2RepName}, ${formData.party2RepDesignation} (Party 2)

        The NDA should have a clear structure with sections like "Definition of Confidential Information", "Non-Disclosure Obligations", "Exclusions", "Term and Termination", and "Governing Law". Use a professional tone.
        Provide only the NDA text without disclaimers or extra information.
      `;

      const response = await axios.post("/api/chat", { prompt });
      setGeneratedText(response.data.reply);
    } catch (error) {
      console.error("Error generating NDA:", error);
      setGeneratedText("Error: Unable to generate NDA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!generatedText) return;
  
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Non-Disclosure Agreement (NDA)</Text>
          <Text style={styles.body}>{generatedText}</Text>
        </Page>
      </Document>
    );
  
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "NDA_Agreement.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen py-10 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-3xl shadow-lg border border-gray-300 dark:border-gray-700">
          <CardHeader className="bg-gray-200 dark:bg-gray-800 p-6 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-center">
              Non-Disclosure Agreement Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="effective-date">Effective Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="effective-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.effectiveDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.effectiveDate ? format(formData.effectiveDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.effectiveDate}
                    onSelect={(date) => setFormData({ ...formData, effectiveDate: date ?? undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(INITIAL_FORM_DATA) as Array<keyof FormData>)
                .filter((key) => key !== "effectiveDate")
                .map((key) => (
                  <div key={key} className="flex flex-col space-y-2">
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                    <Input
                      id={key}
                      name={key}
                      value={formData[key] as string}
                      onChange={handleChange}
                      placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                    />
                  </div>
                ))}
            </div>

            <Button onClick={fetchPersonalizedAgreement} className="w-full mt-4 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Generating..." : "Generate Agreement with AI"}
              <FileText className="h-5 w-5" />
            </Button>

            {generatedText && (
              <Textarea 
                value={generatedText} 
                readOnly 
                className="h-40 mt-4 border-gray-300 dark:border-gray-700" 
              />
            )}

            <Button 
              onClick={generatePDF} 
              className="w-full flex items-center justify-center gap-2 mt-4" 
              disabled={!generatedText}
            >
              Generate & Download PDF
              <Download className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default NDAForm;