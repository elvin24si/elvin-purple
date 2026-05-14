export default function Custom() {
    return (
        <div className="max-w-2xl mx-auto py-10 animate-in fade-in duration-700">
            <header className="mb-12">
                <h2 className="text-[10px] text-indigo-500 font-bold tracking-[0.3em] uppercase mb-2">
                    Bespoke Service
                </h2>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
                    Custom Commission
                </h1>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                    For a custom build tailored to your specific needs, please fill out the form below. Our team of experts will review your request and get back to you within 24-48 business hours.
                </p>
            </header>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Email Input */}
                <div className="space-y-2">
                    <label
                        className="text-[10px] uppercase tracking-widest text-slate-400 font-bold"
                        htmlFor="email"
                    >
                        Contact Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="JohnDoe@gmail.com"
                        className="w-full bg-white border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500 transition-colors rounded-sm"
                    />
                </div>

                {/* Project Brief */}
                <div className="space-y-2">
                    <label
                        className="text-[10px] uppercase tracking-widest text-slate-400 font-bold"
                        htmlFor="brief"
                    >
                        Description
                    </label>
                    <textarea
                        id="brief"
                        rows="6"
                        placeholder="Describe your intended use case (e.g., 4K Video Editing, 4K Streaming, 4K Gaming, LLM Training, etc.) and your preferred aesthetics."
                        className="w-full bg-white border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500 transition-colors rounded-sm resize-none"
                    ></textarea>
                </div>


                <button
                    type="button"
                    className="w-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] py-5 hover:bg-indigo-600 transition-colors duration-300"
                >
                    Submit Custom Request
                </button>
            </form>
        </div>
    );
}