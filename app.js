const WIDTH = 600;
const HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const ROWS_COUNT = 5;
const PADDING = 40;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;



function chart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const step = VIEW_HEIGHT / ROWS_COUNT;

    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    const [yMin, yMax] = computeBoundaries(data);

    console.log(yMin, yMax)
    // === y axis
    ctx.beginPath();
    ctx.strokeStyle = '#bbb';
    ctx.font = 'normal 20px Helvetica,sans-serif';
    ctx.fillStyle = '#96a2aa';

    for (let i = 1; i <= ROWS_COUNT; i++) {
        const y = step * i;
        ctx.fillText(DPI_HEIGHT - y, 5, y + PADDING - 5);
        ctx.moveTo(0, y + PADDING);
        ctx.lineTo(DPI_WIDTH, y + PADDING);
    }

    ctx.stroke();
    ctx.closePath();
    // ===

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff0000';

    for (let [x, y] of data) {
        ctx.lineTo(x, DPI_HEIGHT - PADDING - y);
    }

    ctx.stroke();
    ctx.closePath();
}

chart(document.getElementById('chart'), [
    [0, 0],
    [100, 100],
    [200, 110],
    [300, 200],
    [400, 210],
    [500, 50],
    [600, 20],
    [700, 100],
    [800, 400],
    [900, 200],
    [1000, 330],
    [1100, 200],
    [1200, 0]
]);

function computeBoundaries(data) {
    let min;
    let max;

    for (const [_, y] of data) {
        min = (typeof min !== 'number') || y;
        max = (typeof max !== 'number') || y;

        min = (min > y) || y;
        max = (max < y) || y;
    }

    return [min, max]
}