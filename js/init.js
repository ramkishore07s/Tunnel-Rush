CANVAS = document.getElementById('gl_canvas');
CANVAS.width = window.innerWidth - 10;
CANVAS.height = window.innerHeight - 10;

var GL;
GL = CANVAS.getContext("webgl");

var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
	alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
	return false;
    }
    return shader;
};

var shader_vertex=get_shader(simple_v_shader, GL.VERTEX_SHADER, "VERTEX");
var shader_fragment=get_shader(simple_f_shader, GL.FRAGMENT_SHADER, "FRAGMENT");

var SHADER_PROGRAM=GL.createProgram();
GL.attachShader(SHADER_PROGRAM, shader_vertex);
GL.attachShader(SHADER_PROGRAM, shader_fragment);

GL.linkProgram(SHADER_PROGRAM);

var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
var _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");

var _uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
var _normal = GL.getAttribLocation(SHADER_PROGRAM, "normal");

var _shine = GL.getUniformLocation(SHADER_PROGRAM, "shine");
var _source = GL.getUniformLocation(SHADER_PROGRAM, "source_position");

var _ambient = GL.getUniformLocation(SHADER_PROGRAM, "mat_ambient");
var _diffuse = GL.getUniformLocation(SHADER_PROGRAM, "mat_diffuse");
var _specular = GL.getUniformLocation(SHADER_PROGRAM, "mat_specular");

var _shininess = GL.getUniformLocation(SHADER_PROGRAM, "mat_shininess");
var _greyscale = GL.getUniformLocation(SHADER_PROGRAM, "greyscale");

GL.enableVertexAttribArray(_uv);
GL.enableVertexAttribArray(_position);
GL.enableVertexAttribArray(_normal);

GL.useProgram(SHADER_PROGRAM);
GL.uniform1i(_sampler, 0);
GL.uniform1i(_shine, 0);
GL.uniform3fv(_source,[0,0,0]);
GL.uniform1f(_shininess, 2.0);
GL.uniform1i(_greyscale, false);
GL.uniform3fv(_ambient, [.25, .25, .25]);
GL.uniform3fv(_diffuse, [.3, .3, .3]);
GL.uniform3fv(_specular, [.2, .2, .2]);

function createBuffers(model) {
    var vertexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER,
		  new Float32Array(model.vertices),
		  GL.STATIC_DRAW);

    var uvBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, uvBuffer);
    GL.bufferData(GL.ARRAY_BUFFER,
		  new Float32Array(model.uv),
		  GL.STATIC_DRAW);

    var normalBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, normalBuffer);
    GL.bufferData(GL.ARRAY_BUFFER,
		  new Float32Array(model.normals),
		  GL.STATIC_DRAW);

    var length = model.vertices.length/3;

    return {
	vertexBuffer: vertexBuffer,
	uvBuffer: uvBuffer,
	length: length,
	normalBuffer: normalBuffer,
    };
}

function draw(buf, texture, model, view, projection, num) {
    GL.uniformMatrix4fv(_Mmatrix, false, model);
    GL.uniformMatrix4fv(_Vmatrix, false, view);
    GL.uniformMatrix4fv(_Pmatrix, false, projection);
    if( texture ) {
	if( num == 0 ) {
    	    GL.activeTexture(GL.TEXTURE0);
    	    GL.bindTexture(GL.TEXTURE_2D, texture);
	    GL.uniform1i(_sampler, 0);
	}
	else {
	    GL.activeTexture(GL.TEXTURE1);
	    GL.bindTexture(GL.TEXTURE_2D, texture);
	    GL.uniform1i(_sampler, 1);
	}
    }

    GL.bindBuffer(GL.ARRAY_BUFFER, buf.vertexBuffer);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, buf.normalBuffer);
    GL.vertexAttribPointer(_normal, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, buf.uvBuffer);
    GL.vertexAttribPointer(_uv, 2, GL.FLOAT, false, 0,0);

    GL.drawArrays(GL.TRIANGLES, 0, buf.length)
}
