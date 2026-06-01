export default function InputField({ label, id, type = "text", placeholder, ...props }) {
  return (
    <div className="space-y-2">
      <label
        className="text-[10px] uppercase tracking-widest text-slate-400 font-bold"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500 transition-colors rounded-sm"
        {...props}
      />
    </div>
  );
}