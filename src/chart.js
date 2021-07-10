import './scss/index.scss';
import { tooltip } from './tooltip';
import { circle, computeBoundaries, css, isOver, line, toCoords, toDate } from './utils';

const WIDTH = 600;
const HEIGHT = 200;
const ROWS_COUNT = 5;
const PADDING = 40;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const VIEW_WIDTH = DPI_WIDTH;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const { round } = Math;

export function chart(root, data) {
    let raf;
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const [yMin, yMax] = computeBoundaries(data);
    const yRatio = VIEW_HEIGHT / (yMax - yMin);
    const xRatio = VIEW_WIDTH / (data.columns[0].length - 2);
    const tip = tooltip(root.querySelector('[data-el="tooltip"]'));
    // ==
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseleave', mouseleave);
    // ==

    css(canvas, {
        width: WIDTH + 'px',
        height: HEIGHT + 'px'
    })

    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    const proxy = new Proxy({}, {
        set(...args) {
            const _result = Reflect.set(...args);
            raf = requestAnimationFrame(paint);
            return _result;
        }
    })

    function mousemove({ clientX, clientY }) {
        const { left, top } = canvas.getBoundingClientRect();
        proxy.mouse = {
            x: (clientX - left) * 2,
            tooltip: {
                left: clientX - left + 80,
                top: clientY - top + 10
            }
        }
    }

    function mouseleave() {
        proxy.mouse = null
        tip.hide()
    }

    function xAxis(xData, yData, xRatio) {
        const colsCount = 6;
        const step = round(xData.length / colsCount);
        ctx.beginPath();

        for (let i = 1; i < xData.length; i++) {

            const x = i * xRatio;

            if ((i - 1) % step === 0) {
                const text = toDate(xData[i]).toString();
                ctx.fillText(text, x, DPI_HEIGHT - 10);
            }

            if (isOver(proxy.mouse, x, xData.length, DPI_WIDTH)) {
                ctx.save();
                ctx.moveTo(x, PADDING);
                ctx.lineTo(x, DPI_HEIGHT - PADDING);
                ctx.restore();

                tip.show(proxy.mouse.tooltip, {
                    title: toDate(xData[i]),
                    items: yData.map(col => ({
                        color: data.colors[col[0]],
                        name: data.names[col[0]],
                        value: col[i + 1]
                    }))
                })
            }

        }
        ctx.stroke();
        ctx.closePath();
    }

    function yAxis() {
        const step = VIEW_HEIGHT / ROWS_COUNT;
        const textStep = (yMax - yMin) / ROWS_COUNT;

        ctx.beginPath();
        ctx.strokeStyle = '#bbb';
        ctx.font = 'normal 18px Helvetica,sans-serif';
        ctx.fillStyle = '#96a2aa';
        ctx.lineWidth = 1;

        for (let i = 1; i <= ROWS_COUNT; i++) {
            const y = step * i;
            const text = round(yMax - textStep * i).toString();
            ctx.fillText(text, 5, y + PADDING - 5);
            ctx.moveTo(0, y + PADDING);
            ctx.lineTo(DPI_WIDTH, y + PADDING);
        }

        ctx.stroke();
        ctx.closePath();
    }

    function clear() {
        ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
    }

    function paint() {
        clear();
        const yData = data.columns.filter(col => data.types[col[0]] === 'line');
        const xData = data.columns.filter(col => data.types[col[0]] !== 'line')[0];

        yAxis();
        xAxis(xData, yData, xRatio)

        yData.map(toCoords.bind('_', xRatio, yRatio, DPI_HEIGHT, PADDING))
            .forEach((coords, index) => {
                const color = data.colors[yData[index][0]];
                line(ctx, coords, { color });

                for (const [x, y] of coords) {
                    if (isOver(proxy.mouse, x, coords.length, DPI_WIDTH)) {
                        circle(ctx, [x, y], color);
                        break;
                    }
                }

            });
    }

    return {
        init() {
            paint();
        },
        destroy() {
            cancelAnimationFrame(raf);
            canvas.removeEventListener('mousemove', mousemove);
            canvas.removeEventListener('mouseleave', mouseleave);
        }
    }
}