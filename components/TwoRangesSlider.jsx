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

const MIN_GAP = 4*ONE_HOUR;

class TwoRangesSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			trackingPointer: false,
			alpha: {
				name: 'alpha',
				head: {
					angle: 6*ONE_HOUR,
					type: 'head',
				},
				tail: {
					angle: 0,
					type: 'tail',
				},
			},
			beta: {
				name: 'beta',
				head: {
					angle: 14*ONE_HOUR,
					type: 'head',
				},
				tail: {
					angle: 12*ONE_HOUR,
					type: 'tail',
				},
			},
			
			headAngle: null,
			tailAngle: null,
			selectedSlider: null,
			selectedIndex: null,

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
		this.drawSlider(ctx, this.state.alpha);

		// Draw beta slider
		this.drawSlider(ctx, this.state.beta);
	}

	radialToCardinal = (radius, angle) => {
		return {
			x: radius*Math.cos(angle - Math.PI/2) + CENTER_X,
			y: radius*Math.sin(angle - Math.PI/2) + CENTER_Y
		}
	}

	modulo2Pi = angle => {
		while (angle >= TWO_PI) {
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

	drawSlider = (ctx, slider) => {
		const headAngle = slider.head.angle;
		const tailAngle = slider.tail.angle;

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
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'cyan';
		ctx.stroke();
	}
	
	moveSlider = (e) => {
		const { trackingPointer, selectedSlider, selectedIndex, alpha, beta, headAngle, tailAngle } = this.state;
		const canvas = this.refs.canvas;

		if (trackingPointer) {
			// Calculate position of the slider index from the pointer position
			let relativeX = e.pageX - canvas.offsetLeft - CENTER_X;
			let relativeY = e.pageY - canvas.offsetTop - CENTER_Y;
			let selectedNewAngle = 0;
			if (relativeY == 0) {
				if (relativeX > 0) 
					selectedNewAngle = Math.PI/2;
				else
					selectedNewAngle = Math.PI*3/2;
			}
			else if (relativeX >= 0 && relativeY <= 0) {
				selectedNewAngle = -Math.atan(relativeX/relativeY);
			}
			else if (relativeX >= 0 && relativeY >= 0) {
				selectedNewAngle = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY >= 0) {
				selectedNewAngle = Math.PI - Math.atan(relativeX/relativeY);
			}
			else if (relativeX <= 0 && relativeY <= 0) {
				selectedNewAngle = 2*Math.PI - Math.atan(relativeX/relativeY);
			}

			// Determine opposite index position from selected index position
			const isHeadSelected = selectedIndex.type === 'head';
			let oppositeNewAngle = 0;

			
			if (isHeadSelected) {
				oppositeNewAngle = tailAngle;

				// Head must be greater than tail. We add 2 pi if not.
				if (selectedNewAngle < oppositeNewAngle)
					selectedNewAngle += TWO_PI;
			}
			else {
				oppositeNewAngle = headAngle;

				// Head must be greater than tail. We add 2 pi if not.
				if (selectedNewAngle > oppositeNewAngle)
					oppositeNewAngle += TWO_PI;
			}
			let delta = selectedNewAngle - oppositeNewAngle;
			// If delta is gt 0 then we are selecting head. Otherwise we are selecting tail.
			// We can be sure of that because we are sure that head angle is gt tail angle

			// Max lenght constraint
			if (Math.abs(delta) > EIGHT_HOURS) {
				oppositeNewAngle = selectedNewAngle - Math.sign(delta)*EIGHT_HOURS;
			}

			// Min lenght constraint
			if (Math.abs(delta) < TWO_HOURS) {
				oppositeNewAngle = selectedNewAngle - Math.sign(delta)*TWO_HOURS;
			}

			const localHeadAngle = isHeadSelected ? selectedNewAngle : oppositeNewAngle;
			const localTailAngle = isHeadSelected ? oppositeNewAngle : selectedNewAngle;

			// frontGap stands for angle between current slider's head and next slider's tail
			// rearGap stands for angle between current slider's tail and previous slider's head
			let frontGap = 0;
			let rearGap = 0;

			if (selectedSlider == alpha) {
				frontGap = this.modulo2Pi(beta.tail.angle - localHeadAngle);
				rearGap = this.modulo2Pi(localTailAngle - beta.head.angle);
			}
			else if (selectedSlider == beta) {
				frontGap = this.modulo2Pi(alpha.tail.angle - localHeadAngle);
				rearGap = this.modulo2Pi(localTailAngle - alpha.head.angle);
			}

			// Min distance from other slider constraint. If min gap is not met, no position update
			if (frontGap < MIN_GAP || rearGap < MIN_GAP) {
				return;
			}
			
			// Clear before redraw
			const ctx = canvas.getContext("2d");
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.clearRect(RECT_X, RECT_Y, RECT_WIDTH, RECT_HEIGHT);

			// Draw the big circle
			ctx.beginPath();
			ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, 0, 2*Math.PI);
			ctx.closePath();
			ctx.stroke();
			ctx.strokeStyle = 'cyan';

			// Meant reference comparison
			if (selectedSlider == alpha) {
				// Draw beta slider
				this.drawSlider(ctx, beta);
			}
			else if (selectedSlider == beta) {
				// Draw alpha slider
				this.drawSlider(ctx, alpha);
			}

			// Draw selected slider
			this.drawSlider(ctx, { head: { angle: localHeadAngle }, tail: { angle: localTailAngle } });

			this.setState({
				headAngle: this.modulo2Pi(localHeadAngle),
				tailAngle: this.modulo2Pi(localTailAngle),
				// debug
				relativeX,
				relativeY,
			});
		}
	}

	trackPointer = (e) => {
		const { alpha, beta } = this.state;
		// Check if mouse clicked on the head, tail or neither by comparing clicking point with index center
		const canvas = this.refs.canvas;
		const headAlphaCenter = this.radialToCardinal(INNER_RADIUS, alpha.head.angle);
		const tailAlphaCenter = this.radialToCardinal(INNER_RADIUS, alpha.tail.angle);
		const headBetaCenter = this.radialToCardinal(INNER_RADIUS, beta.head.angle);
		const tailBetaCenter = this.radialToCardinal(INNER_RADIUS, beta.tail.angle);

		const relativeClick = {
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop
		};

		const distanceToHeadAlpha = this.distance(headAlphaCenter, relativeClick);
		const distanceToTailAlpha = this.distance(tailAlphaCenter, relativeClick);
		const distanceToHeadBeta = this.distance(headBetaCenter, relativeClick);
		const distanceToTailBeta = this.distance(tailBetaCenter, relativeClick);
					
		const minDistance = Math.min(distanceToHeadAlpha, distanceToTailAlpha, distanceToHeadBeta, distanceToTailBeta);
		let selectedSlider = null;
		let selectedIndex = null;
		switch (minDistance) {
			case distanceToHeadAlpha:
				selectedSlider = alpha
				selectedIndex = alpha.head;
				break;
			case distanceToTailAlpha:
				selectedSlider = alpha
				selectedIndex = alpha.tail;
				break;
			case distanceToHeadBeta:
				selectedSlider = beta
				selectedIndex = beta.head;
				break;
			case distanceToTailBeta:
				selectedSlider = beta
				selectedIndex = beta.tail;
				break;
		}
		const trackingPointer = minDistance < DOT_RADIUS;

		this.setState({
			trackingPointer,
			selectedSlider,
			selectedIndex,

			headAngle: selectedSlider.head.angle,
			tailAngle: selectedSlider.tail.angle,
		});
	}

	untrackPointer = () => {
		// React state update seems not fast enough with complex objects.
		// So in the mouse move event update only simple type variable in the state
		// Complex variable (sliders) are updated here once mouse is released
		const { selectedSlider, headAngle, tailAngle } = this.state;
		this.setState({
			trackingPointer: false,
			[selectedSlider.name]: {
				name: selectedSlider.name,
				head: {
					angle: this.modulo2Pi(headAngle),
					type: 'head',
				},
				tail: {
					angle: this.modulo2Pi(tailAngle),
					type: 'tail',
				}
			},
		});
	}
	
	render() {
		const { alpha, beta } = this.state;
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
				<h2>Head alpha: {alpha.head.angle * 180 / Math.PI} deg, {alpha.head.angle / Math.PI} pi.rd</h2>
				<h2>Tail alpha: {alpha.tail.angle * 180 / Math.PI} deg, {alpha.tail.angle / Math.PI} pi.rd</h2>
				<h2>Delta: {(alpha.head.angle - alpha.tail.angle) * 180 / Math.PI} deg</h2>
				<h2>Tracking pointer: {this.state.trackingPointer ? 'true' : 'false'}</h2>

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