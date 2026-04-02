import GameCard from "./GameCard";

export default function GameFavorit() {
    const daftarGame = [
        {
            id: 1,
            judul: "Wuthering Waves",
            genre: "RPG / Open World",
            platform: "PC, Mobile",
            rating: 4,
            img: "img/wuwa.jpg"
        },
        {
            id: 2,
            judul: "Valorant",
            genre: "FPS / E-Sports",
            platform: "PC",
            rating: 4,
            img: "img/valorant.jpg"
        },
        {
            id: 3,
            judul: "Ys 8",
            genre: "JRPG / Story",
            platform: "PC",
            rating: 5,
            img: "img/ys 8.avif"
        },
    ];

    return (
        <div>
            <hr />
            <small className="label-section">🎮 Game Favorit</small>
            {daftarGame.map(game => (
                <GameCard key={game.id} {...game} />
            ))}
        </div>
    );
}