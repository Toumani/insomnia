class Header extends React.Component {
	render() {
		return (
			<>
				<h1>INSOMNI?</h1>
				<style jsx>{`
					h1 {
						font-family: 'Comfortaa', cursive;
						position: fixed;
						width: 100%;
						color: lightgrey;
						background-color: black; /* use a gradient */
						margin: 0;
						padding: 4px 10px
					}
				
				`}</style>
			</>
		)
	}
}

export default Header;