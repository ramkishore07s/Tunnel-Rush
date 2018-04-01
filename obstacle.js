function obstacle_1_setup() {
    obstacles = [];
    theta = 0.2;
    pi = Math.PI

    places = [0,1,2,3,1,2,3,2,1,0,1,2,3,0,3,2,1,3,2,3,0,2,0,0,1];
    for (var i=0; i<20; ++i) {
	place = Math.floor(Math.random() * 4);
	place = places[i];
	obstacles.push(createBuffers(model_square));
	obstacles[i].angle = theta + 3 * pi/30 * i;
	obstacles[i].x = 49;
	obstacles[i].y = 0;
	

	obstacles[i].model = mat4.create();

	obstacles[i].rotate = mat4.create();
	obstacles[i].rotate = rotate(obstacles[i].rotate, obstacles[i].angle, [0,1,0]);

	switch(place) {
	case 1:
	    obstacles[i].x -= 5;
	    break;
	case 2:
	    obstacles[i].y -= 5;
	    break;
	case 3:
	    obstacles[i].x += 5;
	    break;
	case 0:
	    obstacles[i].y += 5;
	    break;
	};
	    
	obstacles[i].translate = mat4.create();
	obstacles[i].translate = translate(obstacles[i].translate,
					   [obstacles[i].x, obstacles[i].y, 10]);
	obstacles[i].place = place;

    }
    return obstacles;
}

function collision_detector(eye) {
    for (var i=0; i<10; ++i) {
	o = obstacles[i];
	a = false;
	if( o.angle > 0.18 && o.angle < 0.2 ) {
	    if( o.place == 1 && eye[0] < 50.03 )
		return true;
	    else if( o.place == 2 && eye[1] < 0.03 )
		return true;
	    else if( o.place == 3 && eye[0] > 49.97 )
		return true;
	    else if( o.place == 0 && eye[1] > -0.03 )
		return true;
	}
    }
    return false;
}

z_scale = 2.5;
	    
	
	
o_scale = mat4.create();
mat4.scale(o_scale, o_scale, [5,5,2]);
o_scale_2 = mat4.create();
mat4.scale(o_scale_2, o_scale_2, [1,1,z_scale]);

obstacles = obstacle_1_setup();

function obstacle_draw(o) {
    o.draw = function(rot) {
	mat4.scale(o_scale_2, dummy, [1,1,z_scale]);
	
	o.angle += rot;

	if (o.angle > 2 * Math.PI)
	    o.angle -= 2 * Math.PI;
	if( o.angle < 0 )
	    o.angle += 2 * Math.PI;
	model_rotate = mat4.create();
	model_rotate = rotate(model_rotate, o.angle, [0,1,0]);
	mat4.multiply(o.model, model_rotate, o.translate);
	mat4.multiply(o.model, o_scale_2, o.model);
	mat4.multiply(o.model, o.model, o_scale);
	
	draw(obstacle, texture_1, o.model , view, projection, 1);
    }
}

for (var i=0; i<20; ++i)
    obstacle_draw(obstacles[i]);
