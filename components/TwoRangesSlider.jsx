const CENTER_X = 95;
const CENTER_Y = 50;
const RADIUS = 40;
const DOT_RADIUS = 10;

class TwoRangesSlider extends React.Component {


	constructor(props) {
		super(props);

		this.state = {
			trackingPointer: false,
			radialPosition: 0,

			relativeX: 0,
			relativeY: 0,
			alpha: 0,
		}
	}

	componentDidMount() {
		const ctx = this.refs.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2*Math.PI);
		ctx.stroke();

		let radialPosition = this.radialToCardinal(this.state.radialPosition);
		ctx.beginPath();
		ctx.arc(radialPosition.x, radialPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.stroke();
	}

	radialToCardinal = (angle) => {
		return {
			x: RADIUS*Math.cos(angle - Math.PI/2) + CENTER_X,
			y: RADIUS*Math.sin(angle - Math.PI/2) + CENTER_Y
		}
	}
	
	moveSlider = (e) => {
		if (this.state.trackingPointer) {
			// Clear before redraw
			const canvas = this.refs.canvas;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw the big circle
			ctx.beginPath();
			ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2*Math.PI);
			ctx.stroke();

			// Calculate position of the slider index from the pointer position and draw it
			let relativeX = e.pageX - canvas.offsetLeft - CENTER_X;
			let relativeY = e.pageY - canvas.offsetTop - CENTER_Y;
			let alpha = 0;
			if (relativeX >= 0 && relativeY <= 0) {
				alpha = -Math.atan(relativeX/relativeY);
			}
			else if (relativeX >= 0 && relativeY >= 0) {
				alpha = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY >= 0) {
				alpha = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY <= 0) {
				alpha = 2*Math.PI - Math.atan(relativeX/relativeY);
			}

			let cardinalPosition = this.radialToCardinal(alpha);
			ctx.beginPath();
			ctx.arc(cardinalPosition.x, cardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
			ctx.stroke();

			// Update the status
			this.setState({
				relativeX,
				relativeY,
				alpha,
			});
		}
	}

	trackPointer = () => { this.setState({ trackingPointer: true }); }

	untrackPointer = () => { this.setState({ trackingPointer: false }); }
	
	render() {
		return (
		<div>
			<h1>Hello World</h1>
			<canvas
				id="myCanvas"
				ref="canvas"
				width={200}
				height={100}
				onMouseDown={this.trackPointer}
				onMouseUp={this.untrackPointer}
				onMouseMove={e => this.moveSlider(e)}
			/>
			<h2>{this.state.relativeX}:{this.state.relativeY}</h2>
			<h2>{this.state.alpha * 180 / Math.PI} deg</h2>

			<style jsx>{`
				#myCanvas {
					border: 1px solid #d3d3d3;
				}
			`}</style>
		</div>
		);
	}


}

export default TwoRangesSlider;