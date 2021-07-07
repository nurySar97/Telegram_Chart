const WIDTH = 600;
const HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const ROWS_COUNT = 5;
const PADDING = 40;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;

function chart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const [yMin, yMax] = computeBoundaries(data);
    const step = VIEW_HEIGHT / ROWS_COUNT;
    const textStep = (yMax - yMin) / ROWS_COUNT;
    const yRatio = VIEW_HEIGHT / (yMax - yMin);

    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    // === y axis
    ctx.beginPath();
    ctx.strokeStyle = '#bbb';
    ctx.font = 'normal 20px Helvetica,sans-serif';
    ctx.fillStyle = '#96a2aa';

    for (let i = 1; i <= ROWS_COUNT; i++) {
        const y = step * i;
        const text = (yMax - textStep * i).toString();
        ctx.fillText(text, 5, y + PADDING - 5);
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
        ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRatio);
    }

    ctx.stroke();
    ctx.closePath();
}

chart(document.getElementById('chart'), [
    [0, 0],
    [200, 100],
    [400, 100],
    [600, 200],
    [800, 80],
    [1000, 120],
    [1200, 0]
]);

function computeBoundaries(data) {
    let min;
    let max;

    for (const [_, y] of data) {
        if (typeof min !== 'number') min = y;
        if (typeof max !== 'number') max = y;

        if (min > y) min = y;
        if (max < y) max = y;
    }

    return [min, max]
}