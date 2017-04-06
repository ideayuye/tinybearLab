x = -10:0.1:10; # Create an evenly-spaced vector from -10..10
y = sin (x);    # y is also a vector
#plot (x, y);
#title ("Simple 2-D Plot");
#xlabel ("x");
#ylabel ("sin (x)");

#b = [4; 9; 2] # Column vector
#A = [ 3 4 5;
#      1 3 1;
#      3 5 9 ]
#x = A \ b 

y = sqrt(x);
#plot(x,y);
#title('test');
#xlabel("x");
#ylabel('x^2');

function xdot = f(x,t)
  xdot =  zeros(3,1);
  
  xdot(1) = 77.27 * (x(2)-x(1)*x(2)+x(1)\-8.375e-06*x(1)^2);
  xdot(2) = (x(3)-x(1)*x(2)-x(2))/77.27;
  xdot(3) = 0.161*(x(1)-x(3));
  
 endfunction
 
 x0 = [ 4; 1.1; 4 ];
 
 t = linspace(0,500,1000);
 y = lsode("f",x0,t);
 
 
