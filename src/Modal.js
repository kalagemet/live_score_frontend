import axios from "axios";
import md5 from "md5";
import { useState } from "react";
import { Skeleton } from "./Component";
import "./modal.scss";

export default function Overview(props) {
	const [loading, setLoad] = useState(true);
	const [sortNilai, setSortNilai] = useState(false);
	const [data, setData] = useState([]);

	var loadData = new Promise((result) => {
		let id = props.id || 0;
		let sort = sortNilai ? 1 : 0;
		let headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};
		axios
			.get(
				// "http://10.0.21.30/rest_score/index.php/score",
				"http://penerimaan.stpn.ac.id/api_livescore/rest_score/index.php/score?key=" +
					md5(id.toString() + sort.toString() + "6rw3xm49") +
					"&id_provinsi=" +
					id +
					"&sort_nilai=" +
					sort,
				{ headers }
			)
			.then((response) => {
				result(response);
			});
	});

	if (!props.open) {
		if (!loading) {
			setLoad(true);
		}
		if (data !== undefined) {
			if (data.length > 0) {
				setData([]);
			}
		}
		return null;
	} else {
		if (data !== undefined && loading) {
			if (data.length < 1) {
				loadData
					.then((response) => {
						!response.data.error ? setData(response.data.data) : setData([]);
					})
					.finally(() => setLoad(false));
			}
		}
	}

	return (
		<div className="backdrop_overview">
			<div className="modal_overview">
				<h1>REKAPITULASI HASIL UJIAN</h1>
				{!loading ? (
					<div className="wrapper content_overview">
						<table className="styled-table">
							<thead>
								<tr>
									<th>No</th>
									<th>Provinsi</th>
									<th>Pendaftar</th>
									<th>D-I</th>
									<th>D-IV</th>
									<th>Peserta</th>
									<th>D-I</th>
									<th>D-IV</th>
								</tr>
							</thead>
							<tbody>
								{data !== undefined ? (
									data.length > 0 ? (
										data.map((d, i) => {
											return (
												<tr key={i}>
													<td className="no">{i + 1}.</td>
													<td className="no">{d.provinsi}</td>
													<td>
														{d.jml_pendaftar +
															" (" +
															d.daftar_l +
															" L " +
															d.daftar_p +
															" P)"}
													</td>
													<td>
														{d.pendaftar_di +
															" (" +
															d.pendaftar_di_l +
															" L " +
															d.pendaftar_di_p +
															" P)"}
													</td>
													<td>
														{d.pendaftar_div +
															" (" +
															d.pendaftar_div_l +
															" L " +
															d.pendaftar_div_p +
															" P)"}
													</td>
													<td>
														{d.jml_peserta +
															" (" +
															d.peserta_l +
															" L " +
															d.peserta_p +
															" P)"}
													</td>
													<td>
														{d.peserta_di +
															" (" +
															d.peserta_di_l +
															" L " +
															d.peserta_di_p +
															" P)"}
													</td>
													<td>
														{d.peserta_div +
															" (" +
															d.peserta_div_l +
															" L " +
															d.peserta_div_p +
															" P)"}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td colSpan="7">
												<div className="noData">
													Tidak ada data yang dapat ditampilkan
													<p>Terapkan atau priksa filter yang digunakan</p>
												</div>
											</td>
										</tr>
									)
								) : null}
							</tbody>
						</table>
					</div>
				) : (
					<Skeleton count={10} />
				)}
				<div className="footer_overview">
					<div style={{ textAlign: "center", width: "100%" }}>
						<input
							disabled={data.length < 2}
							type="checkbox"
							id="sort_nilai_modal"
							checked={sortNilai}
							onChange={(e) => {
								setSortNilai(e.target.checked);
								setData([]);
								setLoad(true);
							}}
						></input>
						<label htmlFor="sort_nilai_modal">
							Sortir berdasar jumlah pendaftar
						</label>
					</div>
					<button onClick={() => props.onclose()}>Tutup</button>
				</div>
			</div>
		</div>
	);
}
