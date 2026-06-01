export default function SelectField({ name, options, defaultLabel, onChange, className = "" }) {
  return (
    <select
      name={name}
      onChange={onChange}
      className={`bg-white p-6 text-[10px] font-bold uppercase tracking-[0.2em] border-l border-slate-50 outline-none md:w-72 text-slate-500 ${className}`}
    >
      <option value="">{defaultLabel}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}