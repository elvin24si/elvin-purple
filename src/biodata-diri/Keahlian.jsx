export default function Keahlian({ daftarKeahlian }) {
    return (
        <div>
            <hr />
            <small className="label-section">⚡ Keahlian (Masih Beginner-Level)</small>
            <div className="keahlian-grid">
                {daftarKeahlian.map((keahlian, index) => (
                    <span key={index} className="badge">{keahlian}</span>
                ))}
            </div>
        </div>
    );
}
