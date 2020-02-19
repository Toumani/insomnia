import Head from 'next/head';

import TwoRangesSlider from '../components/TwoRangesSlider';

class App extends React.Component {
	render() {
		return (
			<>
				<Head>
					<link href="https://fonts.googleapis.com/css?family=Lacquer&display=swap" rel="stylesheet" /> 
				</Head>
				<TwoRangesSlider />
				<style jsx>{`
					* {
						font-family: 'Lacquer', sans-serif;
					}
				`}</style>
			</>
		)
	}
}

export default App;