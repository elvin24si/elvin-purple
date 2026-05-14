export default function InfoPribadi({ nama, nim, jurusan, angkatan }) {
    return (
        <div>
            <hr />
            <h2 className="nama-besar">{nama}</h2>
            <p><span className="label">NIM</span> {nim}</p>
            <p><span className="label">Jurusan</span> {jurusan}</p>
            <p><span className="label">Angkatan</span> {angkatan}</p>
        </div>
    );
}
