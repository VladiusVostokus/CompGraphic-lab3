'use strict';

const vsSource = `#version 300 es
in vec3 aColor;
out vec3 vColor;
in vec3 aPosition;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}`;

const fsSource = `#version 300 es
precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}`;

function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("Failde to get context for WebGL");
        return;
    }

    const program = gl.createProgram();
    const vsShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsShader, vsSource);
    gl.compileShader(vsShader);
    gl.attachShader(program, vsShader);

    const fsShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsShader, fsSource);
    gl.compileShader(fsShader);
    gl.attachShader(program, fsShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getShaderInfoLog(vsShader));
        console.log(gl.getShaderInfoLog(fsShader));
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    const aColor = gl.getAttribLocation(program,'aColor');
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uProjectionMatrix = gl.getUniformLocation(program,'uProjectionMatrix');

    const bufferData = new Float32Array([
     -.5,-.5,-.5,   0,1,1,
    -.5, .5, .5,   0,1,1,
    -.5, .5,-.5,   0,1,1,
    -.5,-.5, .5,   0,1,1,
    -.5, .5, .5,   0,1,1,
    -.5,-.5,-.5,   0,1,1,

    .5 ,-.5,-.5,   1,0,1,
    .5 , .5,-.5,   1,0,1,
    .5 , .5, .5,   1,0,1,
    .5 , .5, .5,   1,0,1,
    .5 ,-.5, .5,   1,0,1,
    .5 ,-.5,-.5,   1,0,1,

    -.5,-.5,-.5,   0,1,0,
     .5,-.5,-.5,   0,1,0,
     .5,-.5, .5,   0,1,0,
     .5,-.5, .5,   0,1,0,
    -.5,-.5, .5,   0,1,0,
    -.5,-.5,-.5,   0,1,0,

    -.5, .5,-.5,   1,1,0,
     .5, .5, .5,   1,1,0,
     .5, .5,-.5,   1,1,0,
    -.5, .5, .5,   1,1,0,
     .5, .5, .5,   1,1,0,
    -.5, .5,-.5,   1,1,0,

     .5,-.5,-.5,   0,0,1,
    -.5,-.5,-.5,   0,0,1,
     .5, .5,-.5,   0,0,1,
    -.5, .5,-.5,   0,0,1,
     .5, .5,-.5,   0,0,1,
    -.5,-.5,-.5,   0,0,1,

    -.5,-.5, .5,   1,0,0,
     .5,-.5, .5,   1,0,0,
     .5, .5, .5,   1,0,0,
     .5, .5, .5,   1,0,0,
    -.5, .5, .5,   1,0,0,
    -.5,-.5, .5,   1,0,0,
    ]);
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 3 , gl.FLOAT, false, 6 * 4, 0);
    gl.vertexAttribPointer(aColor, 3 , gl.FLOAT, false, 6 * 4, 3 * 4);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    let angle = 0.0;

    const draw = () => {
        gl.clearColor(0.5, 0.2, 0.6, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (angle === 360.0) angle = 0.0;
        angle++;
        const radian = Math.PI * angle / 180;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
    
        const projectionMatrix = new Float32Array([
            cos,0,-sin,0,
            0,1,0,0,
            sin,0,cos,0,
            0,0,0,1,
        ]);
    
        gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        requestAnimationFrame(draw);
    };
    draw();
}