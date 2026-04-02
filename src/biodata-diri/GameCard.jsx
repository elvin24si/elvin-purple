export default function GameCard({ judul, genre, platform, rating, img }) {
    const bintang = "\u2605".repeat(Number(rating)) + "\u2606".repeat(5 - Number(rating));

    return (
        <div className="game-card-item">
            {img && <img src={img} alt={judul} className="game-img" />}
            <div className="game-info">
                <h3 className="game-judul">{judul}</h3>
                <p><span className="label">Genre</span> {genre}</p>
                <p><span className="label">Platform</span> {platform}</p>
                <p className="game-rating"> <span className="label">Rating Personal</span> {bintang}</p>
            </div>
        </div>
    );
}