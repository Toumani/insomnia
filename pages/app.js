import Head from 'next/head';

import Header from '../components/Header';
import TwoRangesSlider from '../components/TwoRangesSlider';
import Panel from '../components/Panel';

const MIN_WIDTH = 350;
const MIN_HEIGHT = 450;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isPanelOpened: false,
		};
	}

	togglePanel = (isPanelOpened) => {
		this.setState({ isPanelOpened });
	}

	render() {
		const { isPanelOpened } = this.state;
		return (
			<div id="root">
				<Head>
					<meta charSet="utf-8" />

					<link href="https://fonts.googleapis.com/css?family=Lacquer&display=swap" rel="stylesheet" /> 
					<link href="https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet" /> 

					<style>{`
						body {
							margin: 0;
							background-color: darkgray;
						}
					`}</style>
				</Head>
				<Header
					togglePanel={this.togglePanel}
				/>
				<main>
					<TwoRangesSlider
						width={MIN_WIDTH}
						height={MIN_HEIGHT}
					/>
					<Panel
						open={isPanelOpened}
					/>
				</main>
				<style jsx>{`
					* {
						font-family: 'Lacquer', sans-serif;
					}

					#root {
						display: flex;
						flex-direction: column;
						height: 100vh;
						width: 100vw;
						min-width: ${MIN_WIDTH}px;
						min-height: ${MIN_HEIGHT}px;
					}

					main {
						display: flex;
						flex-direction: row;
						height: 100%;
					}
				`}</style>
			</div>
		)
	}
}

export default App;