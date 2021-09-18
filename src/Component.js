export const Cari = (props) => {
	const onChange = (value) => {
		if (props.onChange !== undefined) props.onChange(value);
	};
	return (
		<div className="search">
			<input
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						props.enter();
					}
				}}
				onChange={(e) => onChange(e.target.value)}
				value={props.value === undefined ? null : props.value}
				name="search"
				id="search"
				type="text"
				placeholder="Cari Nama / Nomor..."
			/>
			<label htmlFor="search">Cari Nama / Nomor...</label>
		</div>
	);
};

export const Filter = (props) => {
	const onChange = (value) => {
		if (props.onChange !== undefined)
			props.onChange({
				value: value.value,
				selectedIndex: value.selectedIndex,
				text: value.options[value.selectedIndex].text,
			});
	};
	return (
		<div className="filter_select">
			<select
				value={props.value || ""}
				onChange={(e) => onChange(e.target)}
				id="select_limit"
				className="select_limit"
			>
				{props.data === undefined
					? ""
					: props.data.map((d, i) => {
							return (
								<option key={i} value={d.value}>
									{d.text}
								</option>
							);
					  })}
			</select>
			<label htmlFor="select_limit">{props.label}</label>
		</div>
	);
};

export const Pagination = (props) => {
	const onClick = (index) => {
		props.onClick(index);
	};
	return (
		<div className="pagination__wrapper">
			<ul className="pagination">
				<li>
					<button
						disabled={props.activePage === 1}
						onClick={() => onClick(props.activePage - 1)}
						className={"prev"}
						title="sebelumnya"
					>
						&#10094;
					</button>
				</li>
				{props.activePage > 2 ? (
					<li>
						<button onClick={() => onClick(1)} title="halaman 1">
							1
						</button>
					</li>
				) : (
					""
				)}
				{props.activePage > 2 ? (
					<li>
						<span>...</span>
					</li>
				) : (
					""
				)}
				{props.activePage > 1 ? (
					<li>
						<button
							onClick={() => onClick(props.activePage - 1)}
							title={"halaman " + String(props.activePage - 1)}
						>
							{props.activePage - 1}
						</button>
					</li>
				) : (
					""
				)}
				<li>
					<button className="active" title="halaman saat ini">
						{props.activePage}
					</button>
				</li>
				{props.activePage < props.totalPage ? (
					<li>
						<button
							onClick={() => onClick(props.activePage + 1)}
							title={"halaman " + String(props.activePage + 1)}
						>
							{props.activePage + 1}
						</button>
					</li>
				) : (
					""
				)}
				{props.activePage < props.totalPage - 2 ? (
					<li>
						<span>...</span>
					</li>
				) : (
					""
				)}
				{props.activePage < props.totalPage - 1 ? (
					<li>
						<button
							onClick={() => onClick(props.totalPage)}
							title={"halaman " + String(props.totalPage)}
						>
							{props.totalPage}
						</button>
					</li>
				) : (
					""
				)}
				<li>
					<button
						disabled={props.activePage === props.totalPage}
						onClick={() => onClick(props.activePage + 1)}
						className="next"
						title="selanjutnya"
					>
						&#10095;
					</button>
				</li>
			</ul>
		</div>
	);
};

export const Loading = (props) => {
	return (
		<div className={props.active ? "loading" : "loading finish"}>
			<div className="spiner" />
			<p>Memuat...</p>
		</div>
	);
};

export const Skeleton = (props) => {
	let count = props.count || 1;
	let skeleton = "";
	for (let i = 0; i < count; i++) {
		skeleton += "<span class='row'></span>";
	}
	skeleton +=
		"<span class='pagination'></span><span class='pagination'></span>";
	return (
		<div className="skeleton" dangerouslySetInnerHTML={{ __html: skeleton }} />
	);
};
