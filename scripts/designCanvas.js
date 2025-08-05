let CANVAS_WIDTH, CANVAS_HEIGHT;

let BACKGROUND_RGB_VALS = {
							'RED'  : 0,
							'BLUE' : 0,
							'GREEN': 0,
						};

let PLAYER_RGB_VALS = {
						'RED'  : 255,
						'BLUE' : 255,
						'GREEN': 255,						
					};

let FOOD_COLORS = {
					'RED'  : 102,
					'BLUE' : 179,
					'GREEN': 255,
				};

let DIFFICULTY = 1;
let VEL_X = 35;
let VEL_Y = 0;

let playerBlocks 		= [];
let initialPlayerLength	= 5;
let foodBlock = null;

let buttonClickSound = new Audio("assets/keyPress.oga");
let foodEatenSound   = new Audio("assets/foodEaten.oga");

let startTime = new Date();

document.onkeydown = (e)=>{
	let VEL_TEMP;
	
	switch(e.key){
		case 'a':
		case 'ArrowLeft':
			// SWAPS THE VALUES
			[VEL_X, VEL_Y] = [VEL_Y, -VEL_X];
		break;

		case 'd':
		case 'ArrowRight':
			// SWAPS THE VALUES
			[VEL_X, VEL_Y] = [-VEL_Y, VEL_X];
		break;

		case 'q':
			//INCREASES PLAYER LENGTH, DEBUG OPTION ONLY
			increasePlayerLength();
		break;
			//RESETS PLAYER LENGTH, DEBUG OPTION ONLY
		case 'r':
			resetPlayerSnake();

		default: return;
	}

	buttonClickSound.play();
}

class Block{
	
	constructor(x,y,color,size=30){
		this.pos = {'x' : x, 'y' : y};
		this.size = size;
		this.color = color;
	}
	
	render(){
		push();
			fill(this.color['RED'], this.color['GREEN'], this.color['BLUE']);
			rect(this.pos['x'], this.pos['y'], this.size, this.size,20);
		pop();
	}
}

function setup(){
	frameRate(20 * DIFFICULTY);
	CANVAS_WIDTH  = document.body.clientWidth;
	CANVAS_HEIGHT = document.body.clientHeight;

	for(let i = 0; i < initialPlayerLength; i++)
		playerBlocks.push(new Block(15 + i*VEL_X,40,PLAYER_RGB_VALS));

	randomizeFoodBlock();
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	textSize(32);
}

function draw(){		
	background(	BACKGROUND_RGB_VALS['RED'],
				BACKGROUND_RGB_VALS['GREEN'],
				BACKGROUND_RGB_VALS['BLUE']
		);
	
	playerBlocks.forEach((block) => {
		block.render();
	});
	foodBlock.render();

	updatePlayerBlocks();
	displayaScore();

	let headBlock = playerBlocks[playerBlocks.length - 1];

	// Checks if the headBlock has intersected with any of the other blocks
	// of the player
	for(let i = 0; i < playerBlocks.length - initialPlayerLength; i++)
		if(checkCollision(playerBlocks[i], headBlock)){
			resetPlayerSnake();
			return;
		}

	//Checks if the headBlock is in the vicinity of any foodBlock
	if(checkCollision(headBlock, foodBlock)){
			randomizeFoodBlock();
			increasePlayerLength();
			foodEatenSound.play();
			return;
		}
}

function increasePlayerLength(){
	if(playerBlocks.length == 0)
		return;

	new_x = (playerBlocks[playerBlocks.length - 1].pos['x'] + VEL_X) % CANVAS_WIDTH;
	new_y = (playerBlocks[playerBlocks.length - 1].pos['y'] + VEL_Y) % CANVAS_HEIGHT;

	if(new_x < 0)
		new_x = CANVAS_WIDTH;
	if(new_y < 0)
		new_y = CANVAS_HEIGHT;

	playerBlocks.push(new Block(new_x, new_y, PLAYER_RGB_VALS));

}

function updatePlayerBlocks(){
	
	increasePlayerLength();
	playerBlocks.shift();
	
}

function resetPlayerSnake(){
	startTime = new Date();

	if(playerBlocks.length <= initialPlayerLength)
		return;

	playerBlocks.splice(0, playerBlocks.length - initialPlayerLength);
}

function checkCollision(block1, block2){
	return (
			Math.abs(block1.pos['x'] - block2.pos['x']) < 30
		&& 	Math.abs(block1.pos['y'] - block2.pos['y']) < 30
	);

}

function randomizeFoodBlock(){
	foodBlock = new Block(
						Math.floor(Math.random() * CANVAS_WIDTH * 0.8),
						Math.floor(Math.random() * CANVAS_HEIGHT * 0.8),
						FOOD_COLORS
					);
}

function displayaScore(){
	push();
		fill(200);
		let timeDiff = new Date().getTime() - startTime.getTime();
		let milliseconds = Math.floor(timeDiff % 1000);
		timeDiff /= 1000;

		text(	'امتیاز : ' + (playerBlocks.length - initialPlayerLength) * 100,
				50,50	
			);
		text(	'زمان : ' 	+ Math.floor(timeDiff/60) + ':' + Math.floor(timeDiff%60)
							+ ':' + milliseconds,
				50,90	
			);
	pop();
}
