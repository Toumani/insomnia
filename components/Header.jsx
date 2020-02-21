class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isPanelOpened: false,
		}
	}

	togglePanel = (isPanelOpened) => {
		this.props.togglePanel(isPanelOpened);
		this.setState({ isPanelOpened });
	}

	render() {
		const { isPanelOpened } = this.state;

		return (
			<div id="header-root">
				<div id="logo-container">
					<img src="/logo.svg" alt="Insomnia - Logo" />
				</div>
				<h1 ref="title">INSOMNI{ String.fromCharCode(1051) }</h1>
				<div id="img-container">
				{
					isPanelOpened ?
					(
						<img src="/close.svg" alt="Close" onClick={() => this.togglePanel(false)} />
					)
					:
					(
						<img src="/menu.svg" alt="Menu" onClick={() => this.togglePanel(true)} />
					)
				}
				</div>
				<style jsx>{`
					#header-root {
						width: 100%;
						background-color: black; /* use a gradient */
						position: fixed;
						z-index: 20;
					}
					h1 {
						font-family: 'Comfortaa', cursive;
						display: inline-block;
						color: lightgrey;
						margin: 0;
						padding: 4px 10px;
						vertical-align: middle;
					}
					#logo-container {
						display: inline-block;
						vertical-align: middle;
					}
					#logo-container img {
						width: 45px;
					}
					#img-container {
						position: relative;
						top: 6px;
						right: 10px;
						float: right;
					}
					@media (min-width: 960px) { /* displays only for mobile view */
						#img-container {
							display: none;
						}
					}
					#img-container img {
						width: 40px;
						cursor: pointer;
					}
				`}</style>
			</div>
		)
	}
}

export default Header;