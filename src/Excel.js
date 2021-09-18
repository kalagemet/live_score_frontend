import React, { Component } from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Excel extends Component {
	render() {
		return (
			<ExcelFile
				element={
					<button
						style={{
							zIndex: 111111111,
							background: "black",
							width: "100vw",
							position: "absolute",
						}}
					>
						-
					</button>
				}
				filename={this.props.header}
			>
				{this.props.sesi ? (
					<ExcelSheet data={this.props.data} name={this.props.header}>
						<ExcelColumn label="Nama Peserta" value="nama" />
						<ExcelColumn label="Nomor Ujian" value="nomor_ujian" />
						<ExcelColumn
							label="Jenis Kelamin"
							value={(col) => (col.is_lk === "1" ? "Laki-Laki" : "Perempuan")}
						/>
						<ExcelColumn label="Provinsi" value="provinsi" />
						<ExcelColumn
							label="Program Studi"
							value={(col) =>
								col.sesi.substring(0, 3) === "DIV" ? "D-IV MP" : "D-I PPK"
							}
						/>
						<ExcelColumn
							label="Mulai"
							value={(col) => col.mulai.substring(0, col.mulai.length)}
						/>
						<ExcelColumn
							label="Selesai"
							value={(col) => col.selesai.substring(0, col.selesai.length)}
						/>
						<ExcelColumn
							label="Waktu Ujian"
							value={(col) => (col.submit === "Finished" ? col.waktu : "-")}
						/>
						<ExcelColumn
							label="Status"
							value={(col) =>
								col.submit === "Finished" ? "Selesai" : "Belum Selesai"
							}
						/>
						<ExcelColumn label="Salah" value="salah" />
						<ExcelColumn label="Benar" value="benar" />
						<ExcelColumn label="Nilai" value="score" />
					</ExcelSheet>
				) : (
					<ExcelSheet data={this.props.data} name={this.props.header}>
						<ExcelColumn label="Nama Peserta" value="nama" />
						<ExcelColumn label="Nomor Ujian" value="nomor_ujian" />
						<ExcelColumn
							label="Jenis Kelamin"
							value={(col) => (col.is_lk === "1" ? "Laki-Laki" : "Perempuan")}
						/>
						<ExcelColumn
							label="Sesi"
							value={(col) =>
								col.sesi
									.substring(0, col.sesi.length - 18)
									.replace("DI", "")
									.replace("DIV", "")
									.replace("Pendopo", "")
									.replace("-", "")
									.replace("  ", " ")
									.replace("-", "")
									.replace("Aula", "")
							}
						/>
						<ExcelColumn
							label="Lokasi Ujian"
							value={(col) => col.sesi.split(/(?:,| )+/)[10] + " STPN"}
						/>
						<ExcelColumn
							label="Mulai"
							value={(col) => col.mulai.substring(0, col.mulai.length)}
						/>
						<ExcelColumn
							label="Selesai"
							value={(col) => col.selesai.substring(0, col.selesai.length)}
						/>
						<ExcelColumn
							label="Waktu Ujian"
							value={(col) => (col.submit === "Finished" ? col.waktu : "-")}
						/>
						<ExcelColumn
							label="Status"
							value={(col) =>
								col.submit === "Finished" ? "Selesai" : "Belum Selesai"
							}
						/>
						<ExcelColumn label="Salah" value="salah" />
						<ExcelColumn label="Benar" value="benar" />
						<ExcelColumn label="Nilai" value="score" />
					</ExcelSheet>
				)}
			</ExcelFile>
		);
	}
}
