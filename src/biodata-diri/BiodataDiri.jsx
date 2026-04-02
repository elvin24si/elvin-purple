import ProfilFoto from "./ProfilFoto";
import InfoPribadi from "./InfoPribadi";
import GameFavorit from "./GameFavorit";
import Keahlian from "./Keahlian";
import Hobi from "./Hobi";
import Kontak from "./Kontak";

export default function BiodataDiri() {
    const biodata = {
        nama: "Elvin Winata",
        nim: "2457301039",
        jurusan: "Sistem Informasi",
        angkatan: "G24",
        foto: "img/profil.jpg",
        keahlian: ["React", "JavaScript", "HTML & CSS", "Python", "Git", "MySQL"],
        hobi: [
            "Gaming",
            "Menulis dan membaca novel",
            "Merakit PC",
            "Browsing Shoppee"
        ],
        kontak: {
            email: "elvin24si@mahasiswa.pcr.ac.id",
            github: "github.com/elvin24si",
            instagram: "@winataelvin"
        }
    };

    return (
        <div>
            <ProfilFoto src={biodata.foto} alt={`${biodata.nama}`} />

            <InfoPribadi
                nama={biodata.nama}
                nim={biodata.nim}
                jurusan={biodata.jurusan}
                angkatan={biodata.angkatan}
            />

            <GameFavorit />

            <Keahlian daftarKeahlian={biodata.keahlian} />

            <Hobi daftarHobi={biodata.hobi} />

            <Kontak
                email={biodata.kontak.email}
                github={biodata.kontak.github}
                instagram={biodata.kontak.instagram}
            />

        </div>
    );
}
