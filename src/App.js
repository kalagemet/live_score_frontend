import React, { Component } from "react";
import "./component.scss";
import logoSTPN from "./logo192.png";
import { Cari, Filter, Loading, Pagination, Skeleton } from "./Component";
import axios from "axios";
import { animateScroll } from "react-scroll";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Berita from "./BeritaAcara";
import Excel from "./Excel";

const INTERVAL_UPDATE_DATA = 60000 * 15; //60 s load

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortJK: false,
			sortNL: true,
			waitLoad: true,
			refreshTime: "-",
			activeFilter: 0,
			PROVINSI: [],
			SESI: [],
			loading: false,
			loadingApp: true,
			loadData: false,
			activePage: 1,
			totalPage: 1,
			stringCari: "",
			limit: 25,
			filter: {
				prov: 1,
				sesi: 1,
			},
			header: "",
			text: "",
			data: [],
			totalData: 0,
		};
		this.onLoadFinish = this.onLoadFinish.bind(this);
		this.tableRef = React.createRef();
		this.pageRef = React.createRef();
	}

	onLoadFinish() {
		this.setState({ loadingApp: false });
		// this.interval = setInterval(() => this.loadData(), INTERVAL_UPDATE_DATA);
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
		if (!this.state.loading || !this.state.loadData) {
			if (!this.state.loadData) this.setState({ loadData: true });
			let loading = load || false;
			if (loading) {
				this.setState({ loading: loading });
				animateScroll.scrollToTop({
					duration: 800,
					delay: 0,
					smooth: "easeInOutQuart",
				});
			}
			let body = {
				key: "6rw3xm49",
				page: this.state.activePage,
				limit: this.state.limit,
				sort_jk: this.state.sortJK ? 1 : 0,
				sort_nl: this.state.sortNL ? 1 : 0,
				cari: this.state.stringCari,
				id_daerah: this.state.activeFilter === 2 ? "0" : this.state.filter.prov,
				id_sesi: this.state.activeFilter === 2 ? this.state.filter.sesi : "0",
				id_prodi:
					this.state.activeFilter === 0
						? "01"
						: this.state.activeFilter === 1
						? "02"
						: "0",
			};
			let headers = {
				"Content-Type": "application/x-www-form-urlencoded",
			};
			await axios
				.post(
					// "http://10.0.21.30/rest_score/index.php/score",
					"http://penerimaan.stpn.ac.id/api_livescore/rest_score/index.php/score",
					this.dataQueryString(body),
					{ headers }
				)
				.then((response) => {
					this.setState({
						activePage: response.data.currentPage,
						data: response.data.data,
						totalData: response.data.totalItems,
						totalPage: response.data.totalPages,
						PROVINSI: [{ value: "0", text: "Semua" }, ...response.data.prov],
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
					if (this.state.activeFilter === 2) {
						this.state.filter.sesi === 0
							? this.setState({ header: "" })
							: this.setState({
									header:
										" / " +
										this.state.SESI.find(
											(obj) => obj.value === this.state.filter.sesi.toString()
										).text,
							  });
					} else {
						this.state.filter.prov === 0
							? this.setState({ headers: "" })
							: this.setState({
									header:
										" - PROVINSI " +
										this.state.PROVINSI.find(
											(obj) => obj.value === this.state.filter.prov.toString()
										).text +
										(this.state.activeFilter === 0 ? " (D-I)" : " (D-IV)"),
							  });
					}
				})
				.catch((e) => {
					console.log(e);
					this.setState({ loading: false, loadData: false });
				});
			let time = new Date();
			if (!this.state.waitLoad) {
				setTimeout(
					() => this.setState({ waitLoad: false }, () => this.loadData()),
					INTERVAL_UPDATE_DATA
				);
			}
			this.setState({
				refreshTime:
					"Pembaruan data : " +
					time.getHours() +
					":" +
					(time.getMinutes() < 10 ? "0" : "") +
					time.getMinutes() +
					":" +
					(time.getSeconds() < 10 ? "0" : "") +
					time.getSeconds(),
				loading: false,
				loadData: false,
				waitLoad: true,
			});
		}
	};

	componentDidMount() {
		window.addEventListener("load", this.onLoadFinish);
		window.addEventListener("scroll", this.headerOnScroll);
		this.loadData(true).finally(() =>
			this.setState({ data: [], waitLoad: false, header: "" })
		);
	}

	componentWillUnmount() {
		window.removeEventListener("load", this.onLoadFinish);
		// clearInterval(this.interval);
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

	exportData(func) {
		if (
			!this.state.loading &&
			!this.state.loadingApp &&
			!this.state.loadData &&
			this.state.limit === this.state.totalData.toString() &&
			this.state.data.length > 0
		) {
			func();
		}
	}

	render() {
		return (
			<div className="App">
				<Berita
					sesi={this.state.activeFilter === 2}
					header={this.state.header}
					ref={this.pageRef}
					data={this.state.data}
				/>

				<Loading active={this.state.loadingApp} />
				<div className="header" id="header">
					<ReactToPrint
						pageStyle={"margin=10"}
						documentTitle={new Date()}
						onBeforeGetContent={() => this.setState({ loadingApp: true })}
						content={() => this.pageRef.current}
						onAfterPrint={() => this.setState({ loadingApp: false })}
					>
						<PrintContextConsumer>
							{({ handlePrint }) => (
								<img
									alt="logo stpn"
									onDoubleClick={() => this.exportData(handlePrint)}
									src={logoSTPN}
									className="logo"
								/>
							)}
						</PrintContextConsumer>
					</ReactToPrint>

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
						<h1 ref={this.tableRef}>
							DAFTAR NILAI PCT 2021
							{this.state.header
								.replace(
									this.state.header.substring(
										this.state.header.indexOf("("),
										this.state.header.length
									),
									""
								)
								.replace(
									this.state.header.substring(
										this.state.header.indexOf(","),
										this.state.header.indexOf("|") - 1
									),
									""
								)
								.replace("-", "")
								.replace("DI", "D-I")
								.replace("DIV", "D-IV")
								.toUpperCase()}
						</h1>
						{this.state.loadingApp ? (
							""
						) : this.state.loading ? (
							""
						) : this.state.loadData ? (
							<div className="onload"></div>
						) : (
							<p
								style={{
									fontSize: "medium",
									color: "grey",
									padding: 0,
									margin: 0,
								}}
							>
								<i>
									{this.state.data.length > 0 ? this.state.refreshTime : ""}
								</i>
							</p>
						)}
						<div className="wrapper">
							<div className="data-tables">
								<div className="filter">
									<Cari
										enter={() => this.loadData(true)}
										value={this.state.stringCari}
										onChange={(value) =>
											this.setState({
												stringCari: value,
												activePage: 1,
												limit: 25,
											})
										}
									/>
									<div className="dropdown">
										<Filter
											label="Filter"
											data={[
												{ value: "0", text: "Provinsi D-I PPK" },
												{ value: "1", text: "Provinsi D-IV Pertanahan" },
												{ value: "2", text: "Sesi Ujian" },
											]}
											value={this.state.activeFilter}
											onChange={(value) =>
												this.setState({
													activeFilter: Number(value.value),
													text: "",
													limit: 25,
												})
											}
										/>
										<Filter
											label={
												this.state.activeFilter === 2
													? "Sesi Ujian"
													: "Provinsi"
											}
											value={
												this.state.activeFilter === 2
													? this.state.filter.sesi
													: this.state.filter.prov
											}
											data={
												this.state.activeFilter === 2
													? this.state.SESI
													: this.state.PROVINSI
											}
											onChange={(value) =>
												this.state.activeFilter === 2
													? this.setState({
															filter: {
																...this.state.filter,
																sesi: value.value,
															},
															limit: 25,
															text: value.text,
															activePage: 1,
													  })
													: this.setState({
															filter: {
																...this.state.filter,
																prov: Number(value.value),
															},
															limit: 25,
															text: value.text,
															activePage: 1,
													  })
											}
										/>
										<button
											disabled={this.state.loading}
											onClick={() => this.loadData(true)}
											className="apply-button"
										>
											Tampilkan
										</button>
									</div>
								</div>
								{this.state.loading ? (
									<Skeleton count={(this.state.limit / 25) * 11 + 3} />
								) : (
									<table className="styled-table">
										<thead>
											<tr>
												<th>No.</th>
												<th>Nama Lengkap</th>
												<th>No. Ujian</th>
												<th>Prov</th>
												<th>
													{this.state.header.substring(3, 11) === "PROVINSI"
														? "Sesi"
														: "Program Studi"}
												</th>
												<th>Nilai</th>
											</tr>
										</thead>
										<tbody>
											{this.state.data.length === 0 ? (
												<tr>
													<td colSpan="6">
														<div className="noData">
															Tidak ada data yang dapat ditampilkan
															<p>Terapkan atau priksa filter yang digunakan</p>
														</div>
													</td>
												</tr>
											) : (
												this.state.data.map((d, i) => {
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
															<td>{d.nomor_ujian}</td>
															<td>{d.provinsi}</td>
															<td>
																{this.state.header.substring(3, 11) ===
																"PROVINSI"
																	? d.sesi
																			.replace(
																				d.sesi.substring(
																					d.sesi.indexOf("|") + 8,
																					d.sesi.length
																				),
																				""
																			)
																			.replace("DI -", "")
																	: d.sesi.substring(0, 3) === "DIV"
																	? "D-IV MP"
																	: "D-I PPK"}
															</td>
															<td>{d.score}</td>
														</tr>
													);
												})
											)}
										</tbody>
									</table>
								)}
								<br />
								{this.state.data.length === 0 || this.state.loading ? (
									""
								) : (
									<div style={{ textAlign: "left" }}>
										<Filter
											label="Jumlah data ditampilkan"
											data={[
												{ value: 25, text: "25 Data" },
												{ value: 50, text: "50 Data" },
												(this.state.filter.prov !== 0 ||
													this.state.filter.sesi !== 0) &&
												this.state.stringCari === ""
													? {
															value: this.state.totalData,
															text: "Semua",
													  }
													: { value: 100, text: "100 Data" },
											]}
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
										<input
											type="checkbox"
											id="sort_nilai"
											checked={this.state.sortNL}
											onChange={(e) =>
												this.setState({ sortNL: e.target.checked }, () =>
													this.loadData(true)
												)
											}
										></input>
										<label htmlFor="sort_jk">Sortir berdasar Nilai</label>
										<br />
										<input
											disabled={!this.state.sortNL}
											type="checkbox"
											id="sort_jk"
											checked={this.state.sortJK}
											onChange={(e) =>
												this.setState({ sortJK: e.target.checked }, () =>
													this.loadData(true)
												)
											}
										></input>
										<label htmlFor="sort_jk">Pisah Jenis Kelamin</label>
									</div>
								)}
							</div>
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
				{!this.state.loading &&
				!this.state.loadingApp &&
				!this.state.loadData &&
				this.state.limit === this.state.totalData.toString() &&
				this.state.data.length > 0 ? (
					<Excel
						sesi={this.state.activeFilter === 2}
						header={this.state.header}
						data={this.state.data}
					/>
				) : null}
			</div>
		);
	}
}

export default App;
