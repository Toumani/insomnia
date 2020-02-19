const CENTER_X = 95;
const CENTER_Y = 50;
const RADIUS = 40;
const DOT_RADIUS = 10;

const TWO_PI = 2*Math.PI;
const HALF_PI = Math.PI/2;
const EIGHT_HOURS = Math.PI*4/3;
const TWO_HOURS = Math.PI/3;

class TwoRangesSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			trackingPointer: false,
			headAlpha: HALF_PI,
			tailAlpha: 0,
			headBeta: EIGHT_HOURS,
			tailBeta: Math.PI,
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
		ctx.closePath();
		ctx.stroke();

		// Draw alpha slider
		this.drawSlider(ctx, this.state.headAlpha, this.state.tailAlpha);

		// Draw beta slider
		this.drawSlider(ctx, this.state.headBeta, this.state.tailBeta);
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

	distance = (a, b) => {
		return Math.sqrt(
				Math.pow(a.x - b.x, 2) +
				Math.pow(a.y - b.y, 2)
		);
	}

	drawSlider = (ctx, headAngle, tailAngle) => {
		// Draw the head
		ctx.strokeStyle = 'cyan';
		const headCardinalPosition = this.radialToCardinal(headAngle);
		ctx.beginPath();
		ctx.arc(headCardinalPosition.x, headCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fillStyle = 'cyan';
		ctx.fill();
		ctx.stroke();

		// Draw the tail
		const tailCardinalPosition = this.radialToCardinal(tailAngle);
		ctx.beginPath();
		ctx.arc(tailCardinalPosition.x, tailCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.stroke();

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, RADIUS, tailAngle - HALF_PI, headAngle - HALF_PI);
		// ctx.closePath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'cyan';
		ctx.stroke();
	}
	
	moveSlider = (e) => {
		if (this.state.trackingPointer) {
			// Clear before redraw
			const canvas = this.refs.canvas;
			const ctx = canvas.getContext("2d");
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			const isHeadSelected = this.state.selected === 'headAlpha' || this.state.selected === 'headBeta';
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw the big circle
			ctx.beginPath();
			ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2*Math.PI);
			ctx.closePath();
			ctx.stroke();
			ctx.strokeStyle = 'cyan';

			// Calculate position of the slider index from the pointer position and draw it
			let relativeX = e.pageX - canvas.offsetLeft - CENTER_X;
			let relativeY = e.pageY - canvas.offsetTop - CENTER_Y;
			let angle = 0;
			if (relativeY == 0) {
				if (relativeX > 0) 
					angle = Math.PI/2;
				else
					angle = Math.PI*3/2;
			}
			else if (relativeX >= 0 && relativeY <= 0) {
				angle = -Math.atan(relativeX/relativeY);
			}
			else if (relativeX >= 0 && relativeY >= 0) {
				angle = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY >= 0) {
				angle = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY <= 0) {
				angle = 2*Math.PI - Math.atan(relativeX/relativeY);
			}

			// Draw the selected index
			let cardinalPosition = this.radialToCardinal(angle);
			ctx.beginPath();
			ctx.arc(cardinalPosition.x, cardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
			ctx.closePath();
			if (isHeadSelected) {
				ctx.fillStyle = 'cyan';
				ctx.fill();
			}
			ctx.stroke();

			if (this.state.selected === 'headAlpha' || this.state.selected === 'tailAlpha') {
				this.moveAlphaSlider(ctx, angle, isHeadSelected);
			}
			else if (this.state.selected === 'headBeta' || this.state.selected === 'tailBeta') {
				this.moveBetaSlider(ctx, angle, isHeadSelected);
			}

			// debug
			this.setState({
				relativeX,
				relativeY,
			});
		}
	}

	moveAlphaSlider = (ctx, alpha, isHeadSelected) => {
		// Draw the unselected index
		let unchangedCardinalPosition = {}
		let delta = 0;
		let tailAlpha = 0;
		let headAlpha = 0;
		ctx.beginPath();
		if (isHeadSelected) {
			unchangedCardinalPosition = this.radialToCardinal(this.state.tailAlpha);

			headAlpha = alpha;
			tailAlpha = this.state.tailAlpha;
			if (alpha < tailAlpha)
				alpha += TWO_PI;
			delta = this.modulo2Pi(alpha - tailAlpha);
			if (delta > EIGHT_HOURS) {
				tailAlpha = alpha - EIGHT_HOURS;
			}
			else if (delta < TWO_HOURS) {
				tailAlpha = alpha - TWO_HOURS;
			}
		}
		else {
			unchangedCardinalPosition = this.radialToCardinal(this.state.headAlpha);

			tailAlpha = alpha
			headAlpha = this.state.headAlpha;
			if (headAlpha < alpha)
				alpha -= TWO_PI;
			delta = this.modulo2Pi(headAlpha - alpha);
			if (delta > EIGHT_HOURS) {
				headAlpha = alpha + EIGHT_HOURS;
			}
			else if (delta < TWO_HOURS) {
				headAlpha = alpha + TWO_HOURS;
			}
		}

		if (isHeadSelected) {
			this.setState({
				headAlpha: this.modulo2Pi(alpha),
				tailAlpha: this.modulo2Pi(tailAlpha),
			})
		}
		else {
			this.setState({
				headAlpha: this.modulo2Pi(headAlpha),
				tailAlpha: this.modulo2Pi(alpha),
			})
		}

		ctx.arc(unchangedCardinalPosition.x, unchangedCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		if (!isHeadSelected) {
			ctx.fillStyle = 'cyan';
			ctx.fill();
		}
		ctx.stroke();

		// Draw beta slider
		this.drawSlider(ctx, this.state.headBeta, this.state.tailBeta);

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, RADIUS, tailAlpha - HALF_PI, headAlpha - HALF_PI);
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	moveBetaSlider = (ctx, beta, isHeadSelected) => {
		// Draw the unselected index
		let unchangedCardinalPosition = {}
		let delta = 0;
		let tailBeta = 0;
		let headBeta = 0;
		ctx.beginPath();
		if (isHeadSelected) {
			unchangedCardinalPosition = this.radialToCardinal(this.state.tailBeta);

			headBeta = beta;
			tailBeta = this.state.tailBeta;
			if (beta < tailBeta)
				beta += TWO_PI;
			delta = this.modulo2Pi(beta - tailBeta);
			if (delta > EIGHT_HOURS) {
				tailBeta = beta - EIGHT_HOURS;
			}
			else if (delta < TWO_HOURS) {
				tailBeta = beta - TWO_HOURS;
			}
		}
		else {
			unchangedCardinalPosition = this.radialToCardinal(this.state.headBeta);

			tailBeta = beta
			headBeta = this.state.headBeta;
			if (headBeta < beta)
				beta -= TWO_PI;
			delta = this.modulo2Pi(headBeta - beta);
			if (delta > EIGHT_HOURS) {
				headBeta = beta + EIGHT_HOURS;
			}
			else if (delta < TWO_HOURS) {
				headBeta = beta + TWO_HOURS;
			}
		}

		if (isHeadSelected) {
			this.setState({
				headBeta: this.modulo2Pi(beta),
				tailBeta: this.modulo2Pi(tailBeta),
			})
		}
		else {
			this.setState({
				headBeta: this.modulo2Pi(headBeta),
				tailBeta: this.modulo2Pi(beta),
			})
		}

		ctx.arc(unchangedCardinalPosition.x, unchangedCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		if (!isHeadSelected) {
			ctx.fillStyle = 'cyan';
			ctx.fill();
		}
		ctx.stroke();

		// Draw alpha slider
		this.drawSlider(ctx, this.state.headAlpha, this.state.tailAlpha);

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, RADIUS, tailBeta - HALF_PI, headBeta - HALF_PI);
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	trackPointer = (e) => {
		// Check if mouse clicked on the head, tail or neither by comparing clicking point with index center
		const canvas = this.refs.canvas;
		const headAlphaCenter = this.radialToCardinal(this.state.headAlpha);
		const tailAlphaCenter = this.radialToCardinal(this.state.tailAlpha);
		const headBetaCenter = this.radialToCardinal(this.state.headBeta);
		const tailBetaCenter = this.radialToCardinal(this.state.tailBeta);

		const relativeClick = {
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop
		};

		const distanceToHeadAlpha = this.distance(headAlphaCenter, relativeClick);
		const distanceToTailAlpha = this.distance(tailAlphaCenter, relativeClick);
		const distanceToHeadBeta = this.distance(headBetaCenter, relativeClick);
		const distanceToTailBeta = this.distance(tailBetaCenter, relativeClick);
					
		const minDistance = Math.min(distanceToHeadAlpha, distanceToTailAlpha, distanceToHeadBeta, distanceToTailBeta);
		let selected = 'none';
		switch (minDistance) {
			case distanceToHeadAlpha:
				selected = 'headAlpha';
				break;
			case distanceToTailAlpha:
				selected = 'tailAlpha';
				break;
			case distanceToHeadBeta:
				selected = 'headBeta';
				break;
			case distanceToTailBeta:
				selected = 'tailBeta';
				break;
		}
		const trackingPointer = minDistance < DOT_RADIUS;

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
			<h2>Tracking pointer: {this.state.trackingPointer ? 'true' : 'false'}</h2>
			<h2>Selected: {this.state.selected}</h2>

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