const CENTER_X = 95;
const CENTER_Y = 50;
const RADIUS = 40;
const DOT_RADIUS = 10;

const TWO_PI = 2*Math.PI;
const EIGHT_HOURS = Math.PI*4/3;
const TWO_HOURS = Math.PI/3;

class TwoRangesSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			trackingPointer: false,
			headAlpha: Math.PI/2,
			tailAlpha: 0,
			selected: 'none',

			relativeX: 0, // debug
			relativeY: 0, // debug
		}
	}

	componentDidMount() {
		// Draw the big circle
		const ctx = this.refs.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2*Math.PI);
		ctx.stroke();

		// Draw the head
		const headCardinalPosition = this.radialToCardinal(this.state.headAlpha);
		ctx.beginPath();
		ctx.arc(headCardinalPosition.x, headCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.stroke();

		// Draw the tail
		const tailCardinalPosition = this.radialToCardinal(this.state.tailAlpha);
		ctx.beginPath();
		ctx.arc(tailCardinalPosition.x, tailCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.stroke();
	}

	radialToCardinal = (angle) => {
		return {
			x: RADIUS*Math.cos(angle - Math.PI/2) + CENTER_X,
			y: RADIUS*Math.sin(angle - Math.PI/2) + CENTER_Y
		}
	}

	modulo2Pi = angle => {
		while (angle > TWO_PI) {
			angle -= TWO_PI;
		}
		while (angle < 0) {
			angle += TWO_PI;
		}
		return angle
	}
	
	moveSlider = (e) => {
		if (this.state.trackingPointer) {
			// Clear before redraw
			const canvas = this.refs.canvas;
			const ctx = canvas.getContext("2d");
			const isHeadSelected = this.state.selected === 'head';
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

			// Draw the selected index
			let cardinalPosition = this.radialToCardinal(alpha);
			ctx.beginPath();
			ctx.arc(cardinalPosition.x, cardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
			if (isHeadSelected) {
				ctx.fillStyle = "black";
				ctx.fill();
			}
			ctx.stroke();

			// Draw the unselected index
			let unchangedCardinalPosition = {}
			let delta = 0;
			ctx.beginPath();
			if (isHeadSelected) {
				unchangedCardinalPosition = this.radialToCardinal(this.state.tailAlpha);

				let tailAlpha = this.state.tailAlpha;
				if (alpha < tailAlpha)
					alpha += TWO_PI;
				delta = this.modulo2Pi(alpha - tailAlpha);
				if (delta > EIGHT_HOURS) {
					tailAlpha = alpha - EIGHT_HOURS;
				}
				else if (delta < TWO_HOURS) {
					tailAlpha = alpha - TWO_HOURS;
				}
				this.setState({
					headAlpha: this.modulo2Pi(alpha),
					tailAlpha: this.modulo2Pi(tailAlpha),
				})
			}
			else {
				unchangedCardinalPosition = this.radialToCardinal(this.state.headAlpha);

				let headAlpha = this.state.headAlpha;
				if (headAlpha < alpha)
					alpha -= TWO_PI;
				delta = this.modulo2Pi(headAlpha - alpha);
				if (delta > EIGHT_HOURS) {
					headAlpha = alpha + EIGHT_HOURS;
				}
				else if (delta < TWO_HOURS) {
					headAlpha = alpha + TWO_HOURS;
				}
				this.setState({
					headAlpha: this.modulo2Pi(headAlpha),
					tailAlpha: this.modulo2Pi(alpha),
				})
			}
			ctx.arc(unchangedCardinalPosition.x, unchangedCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
			if (!isHeadSelected) {
				ctx.fillStyle = "black";
				ctx.fill();
			}
			ctx.stroke();

			// Update the status
			this.setState({
				relativeX,
				relativeY,
			});
		}
	}

	trackPointer = (e) => {
		// Check if mouse clicked on the head, tail or neither by comparing clicking point with index center
		const canvas = this.refs.canvas;
		const headCenter = this.radialToCardinal(this.state.headAlpha);
		const tailCenter = this.radialToCardinal(this.state.tailAlpha);
		const relativeX = e.pageX - canvas.offsetLeft;
		const relativeY = e.pageY - canvas.offsetTop;
		const distanceToHead =
				Math.sqrt(
						Math.pow(headCenter.x - relativeX, 2) +
						Math.pow(headCenter.y - relativeY, 2)
				);
		
		const distanceToTail =
				Math.sqrt(
						Math.pow(tailCenter.x - relativeX, 2) +
						Math.pow(tailCenter.y - relativeY, 2)
				);
					
		const selected = Math.min(distanceToHead, distanceToTail) == distanceToHead ? 'head' : 'tail';
		let trackingPointer = false;
		if (selected === 'head') {
			trackingPointer = distanceToHead < DOT_RADIUS;
		}
		else if (selected === 'tail') {
			trackingPointer = distanceToTail < DOT_RADIUS
		}

		this.setState({ trackingPointer, selected });
	}

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
				onMouseDown={e => this.trackPointer(e)}
				onMouseUp={this.untrackPointer}
				onMouseMove={e => this.moveSlider(e)}
			/>
			<h2>{this.state.relativeX}:{this.state.relativeY}</h2>
			<h2>Head alpha: {this.state.headAlpha * 180 / Math.PI} deg</h2>
			<h2>Tail alpha: {this.state.tailAlpha * 180 / Math.PI} deg</h2>
			<h2>Delta: {(this.state.headAlpha - this.state.tailAlpha) * 180 / Math.PI} deg</h2>

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