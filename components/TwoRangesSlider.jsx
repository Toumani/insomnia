const CANVAS_WIDTH = 550;
const CANVAS_HEIGHT = 450;

const CENTER_X = CANVAS_WIDTH/2;
const CENTER_Y = CANVAS_HEIGHT/2;
const INNER_RADIUS = 130;
const OUTER_RADIUS = 150;

const DOT_RADIUS = 10;

const RECT_WIDTH = 2*INNER_RADIUS + 2*DOT_RADIUS + 3;
const RECT_HEIGHT = 2*INNER_RADIUS + 2*DOT_RADIUS + 3;
const RECT_X = CENTER_X - INNER_RADIUS - DOT_RADIUS - 1;
const RECT_Y = CENTER_Y - INNER_RADIUS - DOT_RADIUS - 1;

const TWO_PI = 2*Math.PI;
const HALF_PI = Math.PI/2;
const ONE_HOUR = Math.PI/12;
const EIGHT_HOURS = Math.PI*2/3;
const TWO_HOURS = Math.PI/6;

class TwoRangesSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			trackingPointer: false,
			headAlpha: 6*ONE_HOUR,
			tailAlpha: 0,
			headBeta: 14*ONE_HOUR,
			tailBeta: 12*ONE_HOUR,
			selected: 'none',

			relativeX: 0, // debug
			relativeY: 0, // debug
		}
	}

	componentDidMount() {
		const ctx = this.refs.canvas.getContext("2d");
		// Draw the outer circle (debug)
		ctx.beginPath();
		ctx.strokeStyle = '#DBDBDB';
		ctx.arc(CENTER_X, CENTER_Y, OUTER_RADIUS, 0, 2*Math.PI);
		ctx.stroke();

		// Draw clock digits
		ctx.strokeStyle = 'black';
		const zeroPosition = this.radialToCardinal(OUTER_RADIUS, 0);
		const sixPosition = this.radialToCardinal(OUTER_RADIUS, 6*ONE_HOUR);
		const twelvePosition = this.radialToCardinal(OUTER_RADIUS, 12*ONE_HOUR);
		const eighteenPosition = this.radialToCardinal(OUTER_RADIUS, 18*ONE_HOUR);
		ctx.font = "18px 'Lacquer', sans-serif";
		ctx.fillText('0', zeroPosition.x - 7, zeroPosition.y);
		ctx.fillText('6', sixPosition.x, sixPosition.y);
		ctx.fillText('12', twelvePosition.x - 5, twelvePosition.y + 15);
		ctx.fillText('18', eighteenPosition.x - 15, eighteenPosition.y);

		// Draw the inner circle
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.stroke();

		// Draw the inner rect (debug)
		ctx.beginPath();
		ctx.rect(RECT_X, RECT_Y, RECT_WIDTH, RECT_HEIGHT);
		ctx.stroke();

		// Draw alpha slider
		this.drawSlider(ctx, this.state.headAlpha, this.state.tailAlpha);

		// Draw beta slider
		this.drawSlider(ctx, this.state.headBeta, this.state.tailBeta);
	}

	radialToCardinal = (radius, angle) => {
		return {
			x: radius*Math.cos(angle - Math.PI/2) + CENTER_X,
			y: radius*Math.sin(angle - Math.PI/2) + CENTER_Y
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
		const headCardinalPosition = this.radialToCardinal(INNER_RADIUS, headAngle);
		ctx.beginPath();
		ctx.arc(headCardinalPosition.x, headCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fillStyle = 'cyan';
		ctx.fill();
		ctx.stroke();

		// Draw the tail
		const tailCardinalPosition = this.radialToCardinal(INNER_RADIUS, tailAngle);
		ctx.beginPath();
		ctx.arc(tailCardinalPosition.x, tailCardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fillStyle = 'cyan';
		ctx.fill();
		ctx.stroke();

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, tailAngle - HALF_PI, headAngle - HALF_PI);
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
			ctx.clearRect(RECT_X, RECT_Y, RECT_WIDTH, RECT_HEIGHT);

			// Draw the big circle
			ctx.beginPath();
			ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, 0, 2*Math.PI);
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
			let cardinalPosition = this.radialToCardinal(INNER_RADIUS, angle);
			ctx.beginPath();
			ctx.arc(cardinalPosition.x, cardinalPosition.y, DOT_RADIUS, 0, 2*Math.PI);
			ctx.closePath();
			ctx.fillStyle = 'cyan';
			ctx.fill();
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
			unchangedCardinalPosition = this.radialToCardinal(INNER_RADIUS, this.state.tailAlpha);

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
			unchangedCardinalPosition = this.radialToCardinal(INNER_RADIUS, this.state.headAlpha);

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
		ctx.fillStyle = 'cyan';
		ctx.fill();
		ctx.stroke();

		// Draw beta slider
		this.drawSlider(ctx, this.state.headBeta, this.state.tailBeta);

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, tailAlpha - HALF_PI, headAlpha - HALF_PI);
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
			unchangedCardinalPosition = this.radialToCardinal(INNER_RADIUS, this.state.tailBeta);

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
			unchangedCardinalPosition = this.radialToCardinal(INNER_RADIUS, this.state.headBeta);

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
		ctx.fillStyle = 'cyan';
		ctx.fill();
		ctx.stroke();

		// Draw alpha slider
		this.drawSlider(ctx, this.state.headAlpha, this.state.tailAlpha);

		// Draw arc between head and tail
		ctx.beginPath();
		ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, tailBeta - HALF_PI, headBeta - HALF_PI);
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	trackPointer = (e) => {
		// Check if mouse clicked on the head, tail or neither by comparing clicking point with index center
		const canvas = this.refs.canvas;
		const headAlphaCenter = this.radialToCardinal(INNER_RADIUS, this.state.headAlpha);
		const tailAlphaCenter = this.radialToCardinal(INNER_RADIUS, this.state.tailAlpha);
		const headBetaCenter = this.radialToCardinal(INNER_RADIUS, this.state.headBeta);
		const tailBetaCenter = this.radialToCardinal(INNER_RADIUS, this.state.tailBeta);

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
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
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
					display: block;
					margin: auto;
					border: 1px solid #d3d3d3;
				}
			`}</style>
		</div>
		);
	}


}

export default TwoRangesSlider;