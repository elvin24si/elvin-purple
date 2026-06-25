// src/pages/member/Custom.jsx
import { useRef, useEffect } from "react";
import InputField from "../../components/form/InputField";
import TextAreaField from "../../components/form/TextAreaField";

export default function Custom() {
    const emailRef = useRef(null);
    const briefRef = useRef(null);

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailValue = emailRef.current.value;
        const briefValue = briefRef.current.value;

        if (!emailValue || !briefValue) {
            alert("Harap isi semua kolom!");
            return;
        }

        console.log("Data dikirim ke server:", {
            email: emailValue,
            brief: briefValue
        });

        emailRef.current.value = "";
        briefRef.current.value = "";
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in fade-in duration-700 bg-[#08090C]">
            <header className="mb-12">
                <h2 className="text-[10px] text-[#A78BFA] font-bold tracking-[0.3em] uppercase mb-2">
                    Bespoke Service
                </h2>
                <h1 className="text-3xl font-bold text-[#F4F3EF] uppercase tracking-tight">
                    Custom Commission
                </h1>
                <p className="text-[#9A9DA6] text-sm mt-4 leading-relaxed">
                    For a custom build tailored to your specific needs, please fill out the form below. Our team of experts will review your request and get back to you within 24-48 business hours.
                </p>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit}>

                <InputField
                    ref={emailRef}
                    id="email"
                    type="email"
                    label="Contact Email"
                    placeholder="JohnDoe@gmail.com"
                />

                <TextAreaField
                    ref={briefRef}
                    id="brief"
                    label="Description"
                    placeholder="Describe your intended use case (e.g., 4K Video Editing, 4K Streaming, 4K Gaming, LLM Training, etc.) and your preferred aesthetics."
                />

                <button
                    type="submit"
                    className="w-full bg-[#7C5CFC] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-5 hover:bg-[#6D4DEF] transition-colors duration-300"
                >
                    Submit Custom Request
                </button>
            </form>
        </div>
    );
}