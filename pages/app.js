import Head from 'next/head';

import Header from '../components/Header';
import TwoRangesSlider from '../components/TwoRangesSlider';
import Panel from '../components/Panel';

const MIN_WIDTH = 375;
const MIN_HEIGHT = 450;

class App extends React.Component {
	render() {
		return (
			<div id="root">
				<Head>
					<meta charSet="UTF-8" />

					<link href="https://fonts.googleapis.com/css?family=Lacquer&display=swap" rel="stylesheet" /> 
					<link href="https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet" /> 

					<style>{`
						body {
							margin: 0;
							background-color: darkgray;
						}
					`}</style>
				</Head>
				<Header />
				<TwoRangesSlider
					width={MIN_WIDTH}
					height={MIN_HEIGHT}
				/>
				<Panel />
				<style jsx>{`
					* {
						font-family: 'Lacquer', sans-serif;
					}

					#root {
						display: flex;
						flex-direction: row;
						height: 100vh;
						width: 100vw;
						min-width: ${MIN_WIDTH}px;
						min-height: ${MIN_HEIGHT}px;
					}
				`}</style>
			</div>
		)
	}
}

export default App;