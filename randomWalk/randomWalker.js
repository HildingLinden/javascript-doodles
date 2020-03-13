"use strict";

function opacity() {
	let canvas = document.getElementById("canvas");
	let context = canvas.getContext("2d");

	let x = canvas.width/2;
	let y = canvas.height/2;

	let size = 6;

	context.fillStyle = "rgba(0, 0, 0, 0.05)";
	context.fillRect(x, y, size, size);

	setInterval(() => {
		//let t0 = performance.now();

		let direction = Math.floor(Math.random() * Math.floor(4));

		switch (direction) {
			case 0:
				if (y > 0) {
					y -= size;
				}
				break;
			case 1:
				if (x < canvas.width) {
					x += size;
				}
				break;
			case 2:
				if (y < canvas.height) {
					y += size;
				}
				break;
			case 3:
				if (x > 0) {
					x -= size;
				}
				break;
		}

		context.fillStyle = "rgba(0, 0, 0, 0.05)";
		context.fillRect(x, y, size, size);

		//let t1 = performance.now();
		//console.log(t1 - t0);
	}, 10);
}

function getFreeNeighbors(cells, x, y, rows, columns) {
	let freeNeighbors = new Array();
	if (y > 0 && cells[y-1][x] === 0) freeNeighbors.push(0);
	if (x < columns-1 && cells[y][x+1] === 0) freeNeighbors.push(1);
	if (y < rows-1 && cells[y+1][x] === 0) freeNeighbors.push(2);
	if (x > 0 && cells[y][x-1] === 0) freeNeighbors.push(3);
	return freeNeighbors;
}

function selfAvoiding() {
	let canvas = document.getElementById("canvas");
	let context = canvas.getContext("2d");

	let size = 10;

	let rows = Math.ceil(canvas.height/size);
	let columns = Math.ceil(canvas.width/size);
	let cells = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

	let startX = Math.round(rows/2);
	let startY = Math.round(columns/2);

	let x = startX;
	let y = startY;

	context.fillStyle = "black";
	context.fillRect(x*size, y*size, size-2, size-2);

	let freeNeighbors;

	setInterval(() => {
		//let t0 = performance.now();

		// Search for neighbors that have not been visited
		freeNeighbors = getFreeNeighbors(cells, x, y, rows, columns);
		if (freeNeighbors.length === 0) return;

		// Mark current cell as visited and paint it black
		cells[y][x] = 1;
		context.fillStyle = "black";
		context.fillRect(x*size, y*size, size-2, size-2);

		// Choose a random neighbor
		let direction = Math.floor(Math.random() * Math.floor(freeNeighbors.length));
		switch (freeNeighbors[direction]) {
			case 0:
				y--;
				break;
			case 1:
				x++;
				break;
			case 2:
				y++;
				break;
			case 3:
				x--;
				break;
		}

		// Paint the new cell
		context.fillStyle = "red";
		context.fillRect(x*size, y*size, size-2, size-2);

		//let t1 = performance.now();
		//console.log(t1 - t0);
	}, 100);
}

function moveCell(direction, pos) {
	switch (direction) {
		case 0:
			pos.y--;
			break;
		case 1:
			pos.x++;
			break;
		case 2:
			pos.y++;
			break;
		case 3:
			pos.x--;
			break;
	}
}

function selfAvoidingBacktracking() {
	let intervalId;
	let canvas = document.getElementById("canvas");
	let context = canvas.getContext("2d");
	let slider = document.getElementById("speedSlider");
	let interval = slider.value;
	slider.addEventListener("input", () => {
		interval = slider.value;
	});

	let size = 10;

	let rows = Math.ceil(canvas.height/size);
	let columns = Math.ceil(canvas.width/size);
	let cells = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

	let startX = Math.round(rows/2);
	let startY = Math.round(columns/2);

	let pos = new Object();
	pos.x = startX;
	pos.y = startY;

	context.fillStyle = "black";
	context.fillRect(pos.x*size, pos.y*size, size-2, size-2);

	let freeNeighbors;

	let path = new Array();

	let loop = function() {
		//let t0 = performance.now();

		// Search for neighbors that have not been visited
		freeNeighbors = getFreeNeighbors(cells, pos.x, pos.y, rows, columns);

		// Mark current cell as visited
		cells[pos.y][pos.x] = 1;

		// If there are no free neighbors backtrack until there are
		if (freeNeighbors.length === 0) {
			if (path.length === 0) {
				context.fillStyle = "black";
				context.fillRect(pos.x*size, pos.y*size, size-2, size-2);
				return;
			}

			context.fillStyle = "black";
			context.fillRect(pos.x*size, pos.y*size, size-2, size-2);

			moveCell((path.pop()+2)%4, pos);

			context.fillStyle = "pink";
			context.fillRect(pos.x*size, pos.y*size, size-2, size-2);

			freeNeighbors = getFreeNeighbors(cells, pos.x, pos.y, rows, columns);
		} else {

			// Choose a random neighbor and add it to the path
			let directionIndex = Math.floor(Math.random() * Math.floor(freeNeighbors.length));
			let direction = freeNeighbors[directionIndex];
			path.push(direction);

			context.fillStyle = "black";
			context.fillRect(pos.x*size, pos.y*size, size-2, size-2);

			moveCell(direction, pos);

			// Paint the new cell
			context.fillStyle = "red";
			context.fillRect(pos.x*size, pos.y*size, size-2, size-2);

			//let t1 = performance.now();
			//console.log(t1 - t0);
		}

		setTimeout(loop, interval);
	}
	setTimeout(loop, interval);
}