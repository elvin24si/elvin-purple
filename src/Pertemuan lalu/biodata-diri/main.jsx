import { createRoot } from "react-dom/client";
import BiodataDiri from "./BiodataDiri";
import Container from "./Container";

import './custom.css';

createRoot(document.getElementById("root"))
    .render(
        <div>
            <Container>
                <BiodataDiri/>
            </Container>
        </div>
    );
