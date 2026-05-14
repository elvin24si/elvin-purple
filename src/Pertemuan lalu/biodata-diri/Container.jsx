export default function Container({ children }) {
    return (
        <div className="card">
            <h1>Biodata</h1>
            <br />
            {children}
            <br />
            <footer>
                <p>2026 - Politeknik Caltex Riau</p>
            </footer>
        </div>
    );
}
