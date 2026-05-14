export default function Kontak({ email, github, instagram }) {
    return (
        <div>
            <hr />
            <small className="label-section">📡 Kontak</small>
            <p><span className="label">Email</span> {email}</p>
            <p><span className="label">GitHub</span> {github}</p>
            <p><span className="label">Instagram</span> {instagram}</p>
        </div>
    );
}
