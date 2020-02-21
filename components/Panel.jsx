class Panel extends React.Component {
	constructor(props) {
		super(props);

		this.state = { panelOpacity: 0 };
	}

	componentWillReceiveProps() {
		if (this.state.panelOpacity === 0) {
			setTimeout(() => {
				this.setState({ panelOpacity: 1 });
			}, 50);
		}
		else {
			this.setState({ panelOpacity: 0 });
		}
	}

	render() {
		const panelDisplay = this.props.open ? 'block' : 'none';
		const { panelOpacity } = this.state;

		return (
			<div id="panel-root">
				<h2>Suggest me sleeping time</h2>
				<p>
					I'm <em>extremely</em> insomniac and I need to find the best scheduling for my sleep in a 24h day.
					Suggest me sleeping hours under the following constraints:
				</p>
				<ul>
					<li>
						I can't sleep more than <em>6 hours</em> in a row
					</li>
					<li>
						I can't sleep right after waking up. I need <em>at least 4 hours</em>
					</li>
					<li>
						It's very inconfortable to sleep less than 4 hours. I'm not doing it.
					</li>
				</ul>
				<p>
					Help me!!!
				</p>
				<style jsx>{`
					h2 {
						font-family: 'Comfortaa', cursive;
					}

					#panel-root {
						color: lightgray;
						background-color: black;
						width: 410px;
						height: 100%;
						padding: 45px 10px 0 10px;
						box-sizing: border-box;
						overflow: hidden;
					}

					@media (max-width: 960px) {
						#panel-root {
							display: ${panelDisplay};
							opacity: ${panelOpacity};
							position: fixed;
							width: 100vw;
							z-index: 10;

							transition: opacity 0.4s;
						}

					}
				`}</style>
			</div>
		);
	}
}

export default Panel;