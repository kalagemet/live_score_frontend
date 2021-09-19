import React, { Component } from "react";
import "./beritaacara.scss";
import logo_stpn from "./assets/logo512.png";
import logo_pct from "./assets/logoPCT.png";

export default class Berita extends Component {
	render() {
		return (
			<div className="page_ba">
				<div className="header_ba">
					<img alt="logo_stpn" src={logo_stpn} />
					<div className="header_text">
						SEKOLAH TINGGI PERTANAHAN NASIONAL
						<br />
						KEMENTRIAN ATR / BADAN PERTANAHAN NASIONAL
						<br />
						<h1>PANITIA PENERIMAAN CALON TARUNA</h1>
						<p>
							Jl. Tata Bhumi No. 5, Banyuraden, Gamping, Sleman, Yogyakarta,
							55293
						</p>
					</div>
					<img alt="logo_stpn" src={logo_pct} />
				</div>
				<br />
				<div className="header_title_ba">
					Hasil Ujian <i>Computer Based Tests (CBT)</i>
				</div>
				<br />
				<div className="title_ba">
					<div className="left">
						<table>
							{this.props.sesi ? (
								<tbody>
									<tr>
										<td>Hari/Tanggal Ujian</td>
										<td>:</td>
										<td>
											{this.props.header.substring(
												this.props.header.indexOf("-") + 1,
												this.props.header.indexOf("|")
											)}
										</td>
									</tr>
									<tr>
										<td>Waktu Ujian</td>
										<td>:</td>
										<td>
											{this.props.header
												.substring(this.props.header.indexOf("|") + 1)
												.replace(" Pendopo ", "")
												.replace("-", "")
												.replace(" Aula ", "")}
										</td>
									</tr>
								</tbody>
							) : (
								<tbody>
									<tr>
										<td>Provinsi</td>
										<td>:</td>
										<td>
											{this.props.header === " Semua Provinsi (D-I)" ||
											this.props.header === " Semua Provinsi (D-IV)"
												? this.props.header
														.replace("(D-I)", "")
														.replace("(D-IV)", "")
												: this.props.header.substring(
														11,
														this.props.header.length - 6
												  )}
										</td>
									</tr>
									<tr>
										<td>Program Studi</td>
										<td>:</td>
										<td>
											{this.props.header.substring(
												this.props.header.length - 5,
												this.props.header.length
											) === "(D-I)"
												? "D-I Pengukuran dan Pemetaan Kadastral"
												: "D-IV Manajemen Perpetaan"}
										</td>
									</tr>
								</tbody>
							)}
						</table>
					</div>
					<div className="right">
						<table>
							<tbody>
								<tr>
									<td>Jumlah Peserta</td>
									<td>:</td>
									<td>
										{this.props.data ? this.props.data.length : ""} peserta
									</td>
								</tr>
								{this.props.sesi ? (
									<tr>
										<td>Lokasi Ujian</td>
										<td>:</td>
										<td>
											{this.props.header.split(/(?:,| )+/)[12] +
												" STPN Yogyakarta"}
										</td>
									</tr>
								) : null}
							</tbody>
						</table>
					</div>
				</div>
				<table className="styled-table_ba">
					<thead>
						{this.props.sesi ? (
							<tr>
								<th>No.</th>
								<th>Nama Peserta</th>
								<th>No. Ujian</th>
								<th>Jenis Kelamin</th>
								<th>Provinsi</th>
								<th>Program Studi</th>
								<th>Waktu mulai</th>
								<th>Waktu selesai</th>
								<th>Total Waktu</th>
								<th>Status</th>
								<th>Salah</th>
								<th>Benar</th>
								<th>Nilai</th>
							</tr>
						) : (
							<tr>
								<th>No.</th>
								<th>Nama Peserta</th>
								<th>No. Ujian</th>
								<th>Jenis Kelamin</th>
								<th>Sesi</th>
								<th>Lokasi Ujian</th>
								<th>Waktu mulai</th>
								<th>Waktu selesai</th>
								<th>Total Waktu</th>
								<th>Status</th>
								<th>Salah</th>
								<th>Benar</th>
								<th>Nilai</th>
							</tr>
						)}
					</thead>
					{this.props.data ? (
						<tbody>
							{this.props.sesi
								? this.props.data.map((d, i) => {
										return (
											<tr key={i}>
												<td>{i + 1}.</td>
												<td className="no">{d.nama}</td>
												<td>{d.nomor_ujian}</td>
												<td>{d.is_lk === "1" ? "Laki-Laki" : "Perempuan"}</td>
												<td>{d.provinsi}</td>
												<td>{d.prodi === "02" ? "D-IV MP" : "D-I PPK"}</td>
												<td>{d.mulai.substring(10, d.mulai.length)}</td>
												<td>{d.selesai.substring(10, d.selesai.length)}</td>
												<td>{d.submit === "Finished" ? d.waktu : "-"}</td>
												<td>
													{d.submit === "Finished"
														? "Selesai"
														: "Belum Selesai"}
												</td>
												<td>{d.salah}</td>
												<td>{d.benar}</td>
												<td>{d.score}</td>
											</tr>
										);
								  })
								: this.props.data.map((d, i) => {
										return (
											<tr key={i}>
												<td>{i + 1}.</td>
												<td className="no">{d.nama}</td>
												<td>{d.nomor_ujian}</td>
												<td>{d.is_lk === "1" ? "Laki-Laki" : "Perempuan"}</td>
												<td className="no">
													{d.sesi
														.substring(0, d.sesi.length - 25)
														.replace("DI", "")
														.replace("DIV", "")
														.replace("Pendopo", "")
														.replace("-", "")
														.replace("  ", " ")
														.replace("-", "")
														.replace("Aula", "")}
												</td>
												<td>{d.sesi.split(/(?:,| )+/)[10] + " STPN"}</td>
												<td>{d.mulai.substring(10, d.mulai.length)}</td>
												<td>{d.selesai.substring(10, d.selesai.length)}</td>
												<td>{d.submit === "Finished" ? d.waktu : "-"}</td>
												<td>
													{d.submit === "Finished"
														? "Selesai"
														: "Belum Selesai"}
												</td>
												<td>{d.salah}</td>
												<td>{d.benar}</td>
												<td>{d.score}</td>
											</tr>
										);
								  })}
						</tbody>
					) : null}
				</table>
				<br />
				<table className="ttd">
					<tbody>
						<tr>
							<td>
								Pusat Pengembangan Sumber Daya Manusia
								<br />
								Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional
								<br />
								<br />
								<br />
								<b>
									<u>_______________________________</u>
								</b>
							</td>
							<td>
								Ketua Sekolah Tinggi Pertanahan Nasional
								<br />
								<br />
								<br />
								<br />
								<b>
									<u>Dr. Ir. Senthot Sudirman, M.S.</u>
								</b>
								<br />
								NIP. 19640815 199301 1 003
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}
