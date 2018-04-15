var simple_v_shader = `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 Mmatrix;
uniform mat4 Vmatrix;
uniform mat4 Pmatrix;

varying vec2 Vuv;
varying vec3 Vnormal;
varying vec3 Vview; 

void main(void) {
gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
Vuv = uv;
Vnormal = vec3(Mmatrix * vec4(normal, 0.));
Vview = vec3(Vmatrix * Mmatrix * vec4(position, 1.));
}
`
var simple_f_shader = `
precision highp float;

uniform sampler2D sampler;
uniform bool shine;
uniform bool greyscale;

varying vec2 Vuv;
varying vec3 Vnormal;
varying vec3 Vview;
varying vec3 Vpos;

uniform vec3 source_position;
vec3 source_ambient = vec3(.6,.6,.6);
vec3 source_diffuse = vec3(.3,.3,.3);
vec3 source_specular = vec3(.3,.3,.3);

uniform vec3 mat_ambient;
uniform vec3 mat_diffuse;
uniform vec3 mat_specular;
uniform float mat_shininess;

void main(void) {
vec3 color = vec3(texture2D(sampler, Vuv));

float norm_length = length(source_position - Vview) + 0.1;
vec3 source_direction;

if( shine)
   source_direction = normalize(source_position - Vview);
else {
   source_direction = normalize(vec3(-3,1,3));
   source_specular = vec3(4., 4., 4.);
   source_ambient = vec3(2., 2., 2.);
   source_diffuse = vec3(2.,2.,2.);
}

vec3 ambient = source_ambient * mat_ambient;
vec3 diffuse = source_diffuse * mat_diffuse * max(0., dot(Vnormal, source_direction));
vec3 v = normalize(Vview);
vec3 r = reflect(source_direction, Vnormal);
vec3 specular = source_specular * mat_specular * pow(max(dot(r,v),0.), mat_shininess);

vec3 I = ambient + diffuse + specular;
gl_FragColor = vec4( I * color, 1.0);

gl_FragColor.rgb /= (0.01 * norm_length);

if( greyscale ) {
  float avg = (gl_FragColor.r + gl_FragColor.b + gl_FragColor.g)/3.0;
  gl_FragColor.rgb = vec3(avg, avg, avg);
}

}
`
