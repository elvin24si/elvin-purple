export default function Hobi({ daftarHobi }) {
    return (
        <div>
            <hr />
            <small className="label-section">★ Hobi</small>
            <ul className="hobi-list">
                {daftarHobi.map((hobi, index) => (
                    <li key={index}>{hobi}</li>
                ))}
            </ul>
        </div>
    );
}
