import { createRoot } from "react-dom/client";

import Whiteframe from "./Whiteframe";
import'./tailwind.css';

createRoot(document.getElementById("root"))
    .render(
        <div>
            <Whiteframe/>
        </div>
    )