rand("state",1);
x = 2*rand(1000,1)-1;
y = 2*rand(size(x))-1;
z = sin(2*(x.^2+y.^2));
[xx,yy] = meshgrid(linspace(-1,1,32));
griddata(x,y,z,xx,yy);
