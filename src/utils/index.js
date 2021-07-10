const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CIRCLE_RADIUS = 8;
const { PI, floor } = Math;
// const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function computeXRatio(width, length) {
    return width / (length - 2);
}

export function computeYRatio(height, max, min) {
    return height / (max - min)
}

export function toDate(timestamp) {
    const date = new Date(timestamp);
    return `${shortMonths[date.getMonth()]} ${date.getDate()}`
}

export function isOver(mouse, x, length, dWidth) {
    if (!mouse) return false;
    const _width = dWidth / length;
    return Math.abs(x - mouse.x) < (_width / 2)
}

export function line(ctx, coords, { color }) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = color || '#ff0000';
    coords.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.stroke();
    ctx.closePath();
}

export function circle(ctx, [x, y], color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = '#fff'
    ctx.arc(x, y, CIRCLE_RADIUS, 0, 2 * PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

export function toCoords(xRatio, yRatio, DPI_HEIGHT, PADDING, col) {
    return col.map((y, index) => [
        floor((index - 1) * xRatio),
        floor(DPI_HEIGHT - PADDING - y * yRatio)
    ])
}

export function computeBoundaries({ columns, types }) {
    let min;
    let max;

    columns.forEach(col => {
        if (types[col[0]] !== 'line') return;

        min = typeof min !== 'number' ? col[1] : min;
        max = typeof max !== 'number' ? col[1] : max;

        min = (min > col[1]) ? col[1] : min;
        max = (max < col[1]) ? col[1] : max;

        for (let i = 2; i < col.length; i++) {
            min = (min > col[i]) ? col[i] : min;
            max = (max < col[i]) ? col[i] : max;
        }

    });

    return [min, max]
}

export function css(el, styles = {}) {
    Object.assign(el.style, styles);
}