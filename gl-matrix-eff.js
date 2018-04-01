function lookAt(view, eye, target, up) {
    e = vec3.create();
    t = vec3.create();
    u = vec3.create();
    for(var i=0; i<3; ++i){
	e[i] = eye[i];
	t[i] = target[i];
	u[i] = up[i];
    }

    mat4.lookAt(view, e, t, u);
    return view;
}

function translate(model, by) {
    p = vec3.create();
    for(var i=0; i<3; ++i)
	p[i] = by[i];

    mat4.translate(model, model, p);
    return model;
}

function rotate(model, rad, axis) {
    p = vec3.create();
    for(var i=0; i<3; ++i)
	p[i] = axis[i];

    mat4.rotate(model, model, rad, p);
    return model;
}
    
