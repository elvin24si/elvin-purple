// src/components/form/TextAreaField.jsx
export default function TextAreaField({ label, id, rows = "6", placeholder, ...props }) {
  return (
    <div className="space-y-2">
      <label
        className="text-[10px] uppercase tracking-widest text-[#9A9DA6] font-bold"
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.1] p-4 text-sm text-[#EDECE7] placeholder-[#5A5D65] outline-none focus:border-[#7C5CFC] transition-colors rounded-sm resize-none"
        {...props}
      ></textarea>
    </div>
  );
}