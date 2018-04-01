test = createBuffers(model_square);
test.angle = 0.1;
test.y = 0;

test.x = 47.5;
test.y = 0;

test.theta = Math.PI/4;

test.shape = mat4.create();
mat4.scale(test.shape, test.shape, [1,5,1]);

test.rotate = mat4.create();
test.rotate = rotate(test.rotate, test.angle, [0,1,0]);

test.translate = mat4.create();
test.translate = translate(test.translate, [test.x, test.y, 10]);

test.model = mat4.create();
mat4.multiply(test.model, test.rotate, test.translate);
mat4.multiply(test.model, test.model, test.shape);

d = mat4.create();

function moving_setup() {
    moving = [];
    theta = 0.2;
    pi = Math.PI;
    for(var i=0; i<20; ++i) {
	moving.push(createBuffers(model_square));
	moving[i].angle = 0.2 + 3 * pi/30 * i;
	moving[i].y = 0;
	
	moving[i].shape = mat4.create();
	if( i%2 == 0 ) {
	    mat4.scale(moving[i].shape, moving[i].shape, [2,5,1]);
	    moving[i].x = 50.5;
	}
	else {
	    mat4.scale(moving[i].shape, moving[i].shape, [5,2,1]);
	    moving[i].x = 48;
	}

	moving[i].rotate = mat4.create();
	moving[i].rotate = rotate(moving[i].rotate, moving[i].angle, [0,1,0]);

	moving[i].translate = mat4.create();
	moving[i].translate = translate(moving[i].translate, [moving[i].x, moving[i].y, 10]);

	moving[i].model = mat4.create();
	mat4.multiply(moving[i].model, moving[i].rotate, moving[i].translate);
	mat4.multiply(moving[i].model, moving[i].model, moving[i].shape);

	moving[i].theta = theta;

	moving[i].type = i % 2;

	moving[i].scale2 = mat4.create();
    }

    return moving;
}

moving = moving_setup();

function moving_draw(o) {
    o.draw = function(rot) {
	temp = mat4.create();
	mat4.scale(o.scale2, dummy, [1,1,z_scale]);
	if (o.angle > 2 * Math.PI)
	    o.angle -= 2 * Math.PI;
	if( o.angle < 0 )
	    o.angle += 2 * Math.PI;

	if(o.type == 0 ) {
	    o.trans = o.x +  5 * Math.sin(o.theta);
	    o.translate = translate(mat4.create(), [o.trans ,o.y, 10]);
	}
	else {
	    o.trans = o.y +  5 * Math.sin(o.theta);
	    o.translate = translate(mat4.create(), [o.x, o.trans, 10]);
	}
	//o.rotate = rotate(o.rotate, rot, [0,1,0]);

	o.angle += rot;
	o.rotate = mat4.create();
	o.rotate = rotate(o.rotate, o.angle, [0,1,0]);

	mat4.multiply(o.model, o.rotate, o.translate);
	mat4.multiply(o.model, o.model, o.shape);
	mat4.multiply(o.model, o.scale2, o.model);
	
	draw(o, texture_1, o.model, view, projection, 1);

	o.theta += Math.PI/80;
    };
}

for (var i=0; i<20; ++i)
    moving_draw(moving[i]);

function collision_detector_2(eye) {
    for (var i=10; i<20; ++i) {
	o = moving[i];
	if( o.angle > 0.18 && o.angle < 0.2 ) {
	    if( o.type == 0 ) {
		if( Math.abs(o.trans - eye[0]) < 2.5 )
		    return true;
	    }
	    if( o.type == 1 ) {
	    	if( Math.abs(o.trans - eye[1]) < 2.5 )
	    	    return true;
	    }
	}
    }
    return false;
}
