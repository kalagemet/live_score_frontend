import React, { Component } from "react";
import "./Component.scss";
import logoSTPN from "./logo192.png";
import { Cari, Filter, Loading, Pagination, Skeleton } from "./Component";
import axios from "axios";

const LIMIT_DATA = require("./JSON/LIMIT_DATA.json");
// const PROVINSI = require("./JSON/PROVINSI.json");
// const SESI = require("./JSON/SESI.json");
const INTERVAL_UPDATE_DATA = 10000; //10 s load

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			PROVINSI: [],
			SESI: [],
			loading: true,
			loadingApp: true,
			loadData: true,
			activePage: 1,
			totalPage: 1,
			stringCari: "",
			limit: LIMIT_DATA[0].value,
			filter: {
				prov: 0,
				sesi: 0,
			},
			text: {
				prov: "",
				sesi: "",
			},
			filterIndex: {
				limit: 0,
				prov: 0,
				sesi: 0,
			},
			data: [],
			totalData: 0,
		};
		this.onLoadFinish = this.onLoadFinish.bind(this);
		this.tableRef = React.createRef();
	}

	onLoadFinish() {
		this.setState({ loadingApp: false });
		this.interval = setInterval(() => this.loadData(), INTERVAL_UPDATE_DATA);
	}

	dataQueryString(data = {}) {
		return Object.entries(data)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
			)
			.join("&");
	}

	loadData = async (load) => {
		if (!this.state.loadData) this.setState({ loadData: true });
		let loading = load || false;
		if (loading) {
			this.setState({ loading: loading });
			this.tableRef.current.scrollIntoView({ behavior: "smooth" });
		}
		let body = {
			page: this.state.activePage,
			limit: this.state.limit,
			cari: this.state.stringCari,
			id_daerah: this.state.filter.prov,
			id_sesi: this.state.filter.sesi,
		};
		let headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};
		await axios
			.post(
				"http://10.0.21.30/rest_score/index.php/score",
				this.dataQueryString(body),
				{ headers }
			)
			.then((response) => {
				this.setState({
					activePage: response.data.currentPage,
					data: response.data.data,
					totalData: response.data.totalItems,
					totalPage: response.data.totalPages,
					PROVINSI: response.data.prov,
					SESI: response.data.sesi,
				});
				//set done
				if (!Array.isArray(this.state.data)) {
					this.setState({ data: [] });
				}
				if (!Array.isArray(this.state.SESI)) {
					this.setState({ SESI: [] });
				}
				if (!Array.isArray(this.state.PROVINSI)) {
					this.setState({ PROVINSI: [] });
				}
				if (this.state.loading) this.setState({ loading: false });
				if (this.state.loadData) this.setState({ loadData: false });
			})
			.catch((e) => {
				console.log(e);
				this.setState({ loading: false, loadData: false });
			});
	};

	componentDidMount() {
		window.addEventListener("load", this.onLoadFinish);
		window.addEventListener("scroll", this.headerOnScroll);
		this.loadData();
	}

	componentWillUnmount() {
		window.removeEventListener("load", this.onLoadFinish);
		clearInterval(this.interval);
	}

	headerOnScroll() {
		const distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 50,
			headerElement = document.getElementById("header");
		if (window.innerWidth > shrinkOn) {
			if (distanceY > shrinkOn) {
				if (headerElement !== null) {
					headerElement.classList.add("scroll");
				}
			} else {
				if (headerElement !== null) {
					headerElement.classList.remove("scroll");
				}
			}
		}
	}

	render() {
		return (
			<div className="App">
				<Loading active={this.state.loadingApp} />
				<div className="header" id="header">
					<img alt="logo stpn" src={logoSTPN} className="logo" />
					<div className="title">
						Sekolah Tinggi Pertanahan Nasional
						<p>Kementrian Agraria dan Tata Ruang / Badan Pertanahan Nasional</p>
					</div>
					<div className="headerText">Live Score PCT 2021</div>
				</div>
				<div className="content">
					<div id="particle-container">
						{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((d, i) => {
							return <div key={i} className="particle"></div>;
						})}
					</div>
					{/* Content start */}
					<div className="container" id="container">
						<h1 ref={this.tableRef}>DAFTAR NILAI PCT 2021</h1>
						{this.state.loadingApp ? (
							""
						) : this.state.loading ? (
							""
						) : this.state.loadData ? (
							<div className="onload"></div>
						) : (
							""
						)}
						<div className="wrapper">
							{this.state.loading ? (
								<Skeleton count={(this.state.limit / 25) * 11 + 3} />
							) : (
								<div className="data-tables">
									<div className="filter">
										<Cari
											value={this.state.stringCari}
											onChange={(value) =>
												this.setState(
													{ stringCari: value, activePage: 1 },
													() => this.loadData()
												)
											}
										/>
										<div className="dropdown">
											<Filter
												label="Menampilkan"
												data={LIMIT_DATA}
												value={this.state.limit}
												onChange={(value) =>
													this.setState(
														{
															limit: value.value,
														},
														() => this.loadData(true)
													)
												}
											/>
											<Filter
												label="Provinsi Peserta"
												value={this.state.filter.prov}
												data={this.state.PROVINSI}
												onChange={(value) =>
													this.setState(
														{
															filter: {
																...this.state.filter,
																prov: Number(value.value),
															},
															text: {
																...this.state.text,
																prov: value.value === "0" ? "0" : value.text,
															},
															activePage: 1,
														},
														() => this.loadData(true)
													)
												}
											/>
											<Filter
												label="Sesi Ujian"
												value={this.state.filter.sesi}
												data={this.state.SESI}
												onChange={(value) =>
													this.setState(
														{
															filter: {
																...this.state.filter,
																sesi: value.value,
															},
															text: {
																...this.state.text,
																sesi: value.value === "0" ? "0" : value.text,
															},
															activePage: 1,
														},
														() => this.loadData(true)
													)
												}
											/>
										</div>
									</div>
									{this.state.data.length === 0 ? (
										<div className="noData">
											Tidak ada data yang dapat ditampilkan
											<p>mohon periksa filter, atau hubungi call center STPN</p>
										</div>
									) : (
										<table className="styled-table">
											<thead>
												<tr>
													<th>No.</th>
													<th>Nama Lengkap</th>
													<th>No. Registrasi</th>
													<th>Prov</th>
													<th>Sesi</th>
													<th>Nilai</th>
												</tr>
											</thead>
											<tbody>
												{this.state.data.map((d, i) => {
													return (
														<tr key={i}>
															<td className="no">
																{(this.state.activePage - 1) *
																	this.state.limit +
																	i +
																	1}
																.
															</td>
															<td className="no">{d.nama}</td>
															<td>{d.nomor_pendaftaran}</td>
															<td>{d.provinsi}</td>
															<td>{d.sesi}</td>
															<td>{d.score}</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									)}
								</div>
							)}
						</div>
						{this.state.data.length === 0 || this.state.loading ? (
							""
						) : (
							<div>
								<div className="detail_data">
									Menampilkan{" "}
									{(this.state.activePage - 1) * this.state.limit + 1} -{" "}
									{this.state.data.length +
										(this.state.activePage - 1) * this.state.limit}{" "}
									data dari {this.state.totalData} data
								</div>
								<div className="bootom_page">
									<Pagination
										onClick={(i) =>
											this.setState({ activePage: i }, () =>
												this.loadData(true)
											)
										}
										activePage={this.state.activePage}
										totalPage={this.state.totalPage}
									/>
								</div>
							</div>
						)}
					</div>
					{/* Content end */}
				</div>
				<div className="footer">
					&copy; 2021 Sekolah Tinggi Petanahan Nasional
				</div>
			</div>
		);
	}
}

export default App;
