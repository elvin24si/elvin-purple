// src/components/form/InputField.jsx
export default function InputField({ label, id, type = "text", placeholder, ...props }) {
  return (
    <div className="space-y-2">
      <label
        className="text-[10px] uppercase tracking-widest text-[#9A9DA6] font-bold"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.1] p-4 text-sm text-[#EDECE7] placeholder-[#5A5D65] outline-none focus:border-[#7C5CFC] transition-colors rounded-sm"
        {...props}
      />
    </div>
  );
}