r = 2;
sqrt_r = Math.sqrt(2);
octagon = [
    0, r, 0,
    sqrt_r, sqrt_r, 0,
    r, 0, 0,
    sqrt_r, -sqrt_r, 0,
    0, -r, 0,
    -sqrt_r, -sqrt_r, 0,
    -r, 0, 0,
    -sqrt_r, sqrt_r, 0,
];

R = 60;
r = 40;
a = 10;
b = 50;
sqrt_a = Math.sqrt(a);
b_plus = b + sqrt_a;
b_minus = b - sqrt_a;

x = [b, b_plus, b + a, b_plus, b, b_minus, b - a, b_minus];
z = [b, b_plus, b + a, b_plus, b, b_minus, b - a, b_minus];
y = [a, sqrt_a, 0, -sqrt_a, -a, -sqrt_a, 0, sqrt_a];

theta = 0;
theta_diff = 2;
planes = [];

for(var i=0; i<180; i++) {
    planes.append([]);
    for(var j=0; j<8; ++j) {
	planes[i].append(
    
    
    
    
