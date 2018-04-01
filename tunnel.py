from math import sqrt, sin, cos, pi

R = 60
r = 50
a = 5
b = 50
sqrt_a = a/sqrt(2)
b_plus = b + sqrt_a
b_minus = b - sqrt_a

x = [b, b_plus, b + a, b_plus, b, b_minus, b - a, b_minus]
z = [b, b_plus, b + a, b_plus, b, b_minus, b - a, b_minus]
y = [a, sqrt_a, 0, -sqrt_a, -a, -sqrt_a, 0, sqrt_a]

r2 = sqrt(2.0)

n_y = [cos(-pi/8 - i * pi/4) for i in range(8)]
n_x = [sin(-pi/8 - i * pi/4) for i in range(8)]

angles = [0 + i * pi/4.0 for i in range(8)]


num = 100

theta = 0
theta_diff = 2.0 * pi / num
planes = []
plane_normals = []

model = []
uv = []
normal = []


for i in range(num):
    planes.append([])
    plane_normals.append([])
    planes[i] = [{'x':x[j] * cos(theta),
                  'y':y[j],
                  'z':z[j] * sin(theta)}
                 for j in range(8)]
    plane_normals[i] = [{'x':n_x[j] * cos(theta),
                      'y':n_y[j],
                      'z':n_x[j] * sin(theta)}
                     for j in range(8)]
    theta += theta_diff

for i in range(num):
    cur = planes[i]
    nex = planes[(i+1)%num]

    cur_n = plane_normals[i]
    nex_n = plane_normals[(i+1)%num]

    for j in range(8):
       model.append(cur[j])
       model.append(cur[(j+1)%8])
       model.append(nex[j])

       model.append(nex[j])
       model.append(nex[(j+1)%8])
       model.append(cur[(j+1)%8])

       uv.extend([0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0])

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       normal.append(n_x[j] * cos(theta_diff * i))
       normal.append(n_y[j])
       normal.append(n_x[j] * sin(theta_diff * i))

       # normal.append(n_x[(j+1)%8] * cos(theta_diff * i))
       # normal.append(n_y[(j+1)%8])
       # normal.append(n_x[(j+1)%8] * sin(theta_diff * i))

       # normal.append(n_x[(j+1)%8] * cos(theta_diff * i))
       # normal.append(n_y[(j+1)%8])
       # normal.append(n_x[(j+1)%8] * sin(theta_diff * i))

       # normal.append(n_x[(j+1)%8] * cos(theta_diff * i))
       # normal.append(n_y[(j+1)%8])
       # normal.append(n_x[(j+1)%8] * sin(theta_diff * i))
    

print "model_tunnel2 = {"
print "vertices : ["
n = 0
comma = ","
for i in model:
    print i['x'],comma, i['y'], comma, i['z'], comma
    n += 1
    if n % 3 == 0:
        print
print "],"

print "normals : ["
n = 0
m = 0
for i in normal:
    print i,comma
    m += 1
    if m%3 == 0:
        print ""
        n += 1
    if n%3 == 0:
        print
print "],"

print "uv : ["
n = 0
for i in range(0, len(uv), 2):
    print uv[i], comma, uv[i+1], comma
    n+= 1
    if n%3 == 0:
        print
print "],"
    

print "}"
