import { createRoot } from 'react-dom/client'
import'./assets/tailwind.css';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import "@fontsource/plus-jakarta-sans"; // Defaults to weight 400
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

createRoot(document.getElementById("root"))
  .render(
      <BrowserRouter>
		      <App />
      </BrowserRouter>
  )
