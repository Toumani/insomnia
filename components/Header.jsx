class Header extends React.Component {
	render() {
		return (
			<div id="header-root">
				<div id="logo-container">
					<img src="/logo.png" alt="Insomnia - Logo" />
				</div>
				<h1>INSOMNI?</h1>
				<div id="img-container">
					<img src="/close.svg" alt="Close" />
				</div>
				<style jsx>{`
					#header-root {
						width: 100%;
						background-color: black; /* use a gradient */
						position: fixed;
					}
					h1 {
						font-family: 'Comfortaa', cursive;
						display: inline-block;
						color: lightgrey;
						margin: 0;
						padding: 4px 10px;
						vertical-align: middle;
					}
					@media (min-width: 960px) {
						#img-container {
							display: none;
						}
					}
					#logo-container {
						display: inline-block;
						vertical-align: middle;
					}
					#img-container {
						position: relative;
						top: 2px;
						right: 10px;
						float: right;
					}
					#img-container img {
						width: 40px;

					}
				`}</style>
			</div>
		)
	}
}

export default Header;