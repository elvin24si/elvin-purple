import React, { useState, useEffect } from 'react';

// Reusable Component
const FormField = ({ label, children, error }) => (
  <div className="space-y-1 py-2">
    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-tight">{label}</label>
    {children}
    {/* Error Alert below input */}
    {error && (
      <div className="bg-red-50 border-l-2 border-red-500 px-2 py-1 mt-1">
        <p className="text-[9px] text-red-600 font-medium italic">{error}</p>
      </div>
    )}
  </div>
);

export default function LoginForm({ onDeploy }) {
  const [formData, setFormData] = useState({ 
    clientName: '', 
    email: '', 
    serialKey: '', 
    chassis: '', 
    cooling: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation Logic (3 per field)
  const validate = (name, value) => {
    let msg = "";
    if (name === 'clientName') {
      if (!value) msg = "Required";
      else if (/\d/.test(value)) msg = "Numbers not allowed in Name";
      else if (value.length < 3) msg = "Minimum 3 characters";
    }
    if (name === 'email') {
      if (!value) msg = "Required";
      else if (!value.includes('@')) msg = "Missing @ symbol";
      else if (!value.endsWith('.com')) msg = "Only .com domains accepted";
    }
    if (name === 'serialKey') {
      if (!value) msg = "Required";
      else if (value.length !== 8) msg = "Must be exactly 8 chars";
      else if (!/^[A-Z0-9]+$/.test(value)) msg = "Alphanumeric Uppercase only";
    }
    if (name === 'chassis' || name === 'cooling') {
      if (!value) msg = "Selection required";
    }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  // Check if form is valid to show Submit button
  useEffect(() => {
    const hasValues = Object.values(formData).every(x => x !== "");
    const hasNoErrors = Object.values(errors).every(x => x === "");
    setIsValid(hasValues && hasNoErrors);
  }, [formData, errors]);

  return (
    <div className="space-y-4">
      <FormField label="Client Identity" error={errors.clientName}>
        <input name="clientName" value={formData.clientName} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 p-2 text-sm rounded focus:ring-1 focus:ring-black outline-none" placeholder="John Doe" />
      </FormField>

      <FormField label="Contact Email" error={errors.email}>
        <input name="email" value={formData.email} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 p-2 text-sm rounded focus:ring-1 focus:ring-black outline-none" placeholder="name@labs.com" />
      </FormField>

      <FormField label="System Serial (8 Chars)" error={errors.serialKey}>
        <input name="serialKey" value={formData.serialKey} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 p-2 text-sm rounded focus:ring-1 focus:ring-black outline-none" placeholder="WF1000XJ" />
      </FormField>

      {/* Select Dropdown 1 */}
      <FormField label="Chassis Type" error={errors.chassis}>
        <select name="chassis" value={formData.chassis} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 p-2 text-sm rounded outline-none">
          <option value="">Select Frame...</option>
          <option value="Mini-ITX">Alpha Mini-ITX (Compact)</option>
          <option value="Mid-Tower">Beta Mid-Tower (Balanced)</option>
          <option value="Full-Tower">Titan Full-Tower (High-End)</option>
        </select>
      </FormField>

      {/* Select Dropdown 2 */}
      <FormField label="Thermal Solution" error={errors.cooling}>
        <select name="cooling" value={formData.cooling} onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 p-2 text-sm rounded outline-none">
          <option value="">Select Cooling...</option>
          <option value="Air">Standard Air Flow</option>
          <option value="Liquid">AIO Liquid Cooling</option>
          <option value="Custom">Custom Hard-Loop</option>
        </select>
      </FormField>

      {/* Conditional Rendering: Submit Button */}
      {isValid && (
        <button 
          onClick={() => onDeploy(formData)}
          className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-widest py-4 rounded hover:bg-gray-800 transition-all shadow-lg active:scale-95 mt-6">
          Authorize Order
        </button>
      )}
    </div>
  );
}