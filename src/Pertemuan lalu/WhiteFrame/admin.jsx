import { createRoot } from "react-dom/client";

import AdminInventory from "./AdminInventory";
import'./tailwind.css';

createRoot(document.getElementById("root"))
    .render(
        <div>
            <AdminInventory/>
        </div>
    )