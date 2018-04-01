var shader_vertex_source="\n\
attribute vec3 position;\n\
attribute vec2 uv;\n\
attribute vec3 normal;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
varying vec2 vUV;\n\
varying vec3 vNormal;\n\
varying vec3 vView;\n\
\n\
void main(void) {\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vNormal=vec3(Mmatrix*vec4(normal, 0.));\n\
vView=vec3(Vmatrix*Mmatrix*vec4(position, 1.));\n\
vUV=uv;\n\
}";


var shader_fragment_source="\n\
precision mediump float;\n\
uniform sampler2D sampler;\n\
varying vec2 vUV;\n\
varying vec3 vNormal;\n\
varying vec3 vView;\n\
const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
const vec3 source_diffuse_color=vec3(1.,2.,4.);\n\
const vec3 source_specular_color=vec3(1.,1.,1.);\n\
const vec3 source_direction=vec3(0.,0.,1.);\n\
\n\
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 mat_specular_color=vec3(1.,1.,1.);\n\
const float mat_shininess=10.;\n\
\n\
\n\
\n\
void main(void) {\n\
vec3 color=vec3(texture2D(sampler, vUV));\n\
vec3 I_ambient=source_ambient_color*mat_ambient_color;\n\
vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
vec3 V=normalize(vView);\n\
vec3 R=reflect(source_direction, vNormal);\n\
\n\
\n\
vec3 I_specular=source_specular_color*mat_specular_color*pow(max(dot(R,V),0.), mat_shininess);\n\
vec3 I=I_ambient+I_diffuse+I_specular;\n\
gl_FragColor = vec4(I*color, 1.);\n\
}";

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
