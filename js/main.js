counter = 2000;
level = 1;

right = false;
left = false;
jump = false;
ground = true;
greyscale = false;

GL.uniform1i(_shine, true);

function keyDownHandler(event) {
    if( event.keyCode == 39 )
	right = true;
    if( event.keyCode == 37 )
	left = true;
    if( event.keyCode == 38 ) {
	console.log("sadlfjk");
	jump = true;
    }
    if( String.fromCharCode(event.keyCode) == "G" )
	greyscale = !greyscale;
}

function keyUpHandler(event) {
    if( event.keyCode == 39 )
	right = false;
    if( event.keyCode == 37 )
	left = false;
    if( event.keyCode == 38 )
	jump = false;
}

model = mat4.create();
mat4.scale(model, model, [1,1,z_scale]);

dummy = mat4.create();
t_scale = mat4.create();
t_rotate = mat4.create();

//--------------------- view ----------------------

eye = [50, 1, 0];
target = [49, 1, 2];
up = [0,1,0];

up_angle = 0;

view = mat4.create();
view = lookAt(view, eye, target, up);

// ----------------- projection -------------------

projection = mat4.create();
mat4.perspective(projection, 1, 14/9, 0.5, 150);


// =================== inputs ====================

document.onkeydown = keyDownHandler;
document.onkeyup = keyUpHandler;

tunnel.draw = function() {
    mat4.scale(t_scale, dummy, [1,1,z_scale]);
    mat4.multiply(model, t_scale, t_rotate);
        
    draw(tunnel, texture_0, model, view, projection, 0);
} 

var then = 0;
var rot = 0.001;
var max = 3.4;
var len = max;
var positive = true;
var z_positive = true;

end = false;

function render(now) {
    --counter;
    if( counter == 0 ) {
	counter = 1000;
    }
    
    z_scale = rot * 50 + 1;
    now *= 0.001;
    t_rotate = rotate(t_rotate, rot, [0,1,0]);
    const deltaTime = now - then;
    then = now;
    if( rot < 0.01 )
	rot += 0.00001;

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GL.uniform3fv(_source, [0, 0, 6]);
    GL.uniform1i(_greyscale, greyscale);

    d = obstacles[0].angle;

    GL.uniform1f(_shininess, 2.0);
    GL.uniform3fv(_ambient, [.25, .25, .25]);
    GL.uniform3fv(_diffuse, [.3, .3, .3]);
    GL.uniform3fv(_specular, [.2, .2, .2]);


    tunnel.draw();

    GL.uniform1f(_shininess, 2.0);
    GL.uniform3fv(_ambient, [.25, .25, .25]);
    GL.uniform3fv(_diffuse, [.06, .06, .06]);
    GL.uniform3fv(_specular, [.001, .001, .001]);

    if( counter % 1000 > 900) {
	if( Math.floor(Math.random() * 100 > 90 ) && d < 0.5 && d > 0) {
    	    GL.uniform1i(_shine, false);
	}
	else
	    GL.uniform1i(_shine, true);
    }
    else {
    	GL.uniform1i(_shine, true);
    }

    if( level == 1 ) {
//	   obstacle.draw();
	for( var i=1; i<10; ++i )
	    obstacles[i].draw(rot);

	if( collision_detector(eye)) {
	    end = true;
	    greyscale = true;
	    requestAnimationFrame(render);
	}
    }

    if( level == 1 ) {
	for (var i=10; i<20; ++i )
		moving[i].draw(rot);
	if( collision_detector_2(eye)) {
	    end = true;
	    greyscale = true;
	    requestAnimationFrame(render);
	}

    }
    
    if( left && !right )
	up_angle += rot * 12;
    if( right && !left )
	up_angle -= rot * 12;

    if( jump && ground ) {
	len -= 0.0001;
	ground = false;
    }

    if( !ground && positive )
	len -= len/8;
    if( !ground && !positive )
	len += len/8;
    if( len < 0.3 )
	positive = false;
    if( len > max ) {
	positive = true;
	ground = true;
	len = max;
    }
    
    up[0] = len * Math.cos(up_angle);
    up[1] = len * Math.sin(up_angle);

    eye[0] = 50.0 - up[0];
    eye[1] = 1 - up[1];

    target[0] = 50.0 - up[0];
    target[1] = 1 - up[1];

    view = lookAt(view, eye, target, up);
    if( !end)
	requestAnimationFrame(render);
    
}
requestAnimationFrame(render)

