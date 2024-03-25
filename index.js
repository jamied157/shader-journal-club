const vertShader = `attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragShader = `
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float seed;

void main() {
    vec2 coord = gl_FragCoord.xy / resolution;

    // Output RGB color in range from 0.0 to 1.0
    vec3 color = vec3(coord.x, 0, coord.y);
    color.y += abs(sin(time));

    // 1. Uncomment these lines to draw triangles
    vec2 squareCoord = 20.0 * gl_FragCoord.xy / resolution.y + vec2(time);
    vec2 loc = fract(squareCoord);
    float size = sqrt(pow(2.5 * loc.y - 1.2, 2.0) + pow(2.5 * loc.x - 1.2, 2.0));
    color = vec3(smoothstep(-0.05, 0.05, size - 1.0));

    // 2. Uncomment these lines to invert some of the triangles
    vec2 cell = squareCoord - loc;
    // if (mod(2.0 * cell.x + cell.y, 5.0) == 1.0) {
    //  color = 1.0 - color;
    // }

    // 3. Uncomment these lines to produce interesting colors
    float c_ = 3.0 * cell.x + 2.0 * cell.y;
    vec3 c = vec3(mod(c_, 7.0) / 7.0, mod(c_, 4.0) / 4.0, mod(c_, 3.0) / 3.0);
    color = 1.0 - (1.0 - color) * c;

    // 4. Uncomment to lighten the colors
    color = sqrt(color);

    gl_FragColor = vec4(color, 1.0);
}`;

const regl = createREGL();

const drawQuilt = regl({
    frag: fragShader,
    vert: vertShader,
    attributes: {
        position: [
            [-1, 1],
            [-1, -1],
            [1, 1],
            [1, -1],
        ],
    },
    elements: [
        [0, 1, 2],
        [2, 1, 3],
    ],
    uniforms: {
        resolution: ({ drawingBufferWidth, drawingBufferHeight }) => [
            drawingBufferWidth,
            drawingBufferHeight,
        ],
        time: regl.context("time"),
        seed: 0,
    },
});


regl.frame(function () {
    regl.clear({
        color: [1, 0, 0, 1]
    });
    drawQuilt();
});

