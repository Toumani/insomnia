import Head from 'next/head';

import Header from '../components/Header';
import TwoRangesSlider from '../components/TwoRangesSlider';

class App extends React.Component {
	render() {
		return (
			<div id="root">
				<Head>
					<meta charset="UTF-8" />

					<link href="https://fonts.googleapis.com/css?family=Lacquer&display=swap" rel="stylesheet" /> 
					<link href="https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet" /> 
				</Head>
				<Header />
				<TwoRangesSlider />
				<style jsx>{`
					* {
						font-family: 'Lacquer', sans-serif;
					}

					body {
						margin: 0;
						background-color: lightgray;
					}

					#root {
						display: flex;
						flex-direction: row;
						height: 100vh;
						width: 100vw;
					}
				`}</style>
			</div>
		)
	}
}

export default App;