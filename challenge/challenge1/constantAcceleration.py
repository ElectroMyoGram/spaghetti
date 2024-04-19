import numpy as np
import matplotlib.pyplot as plt

#essentially simple model with constant acceleration
#SUVAT
def get_values(u=20, g=9.8, theta=(0.25*np.pi), h=2):
    #u = initial velocity
    #g = gravitional strength
    #theta = angle of launch
    #h = height projectile is launched from
    #set up constant gravitational acceleration (-9.8)
    a = -g

    #works out strength of x velocity and y velocity based on size of initial velocity (u) and angle of launch
    u_x = u * np.cos(theta)
    u_y = u * np.sin(theta)
    dt = 0.01

    #equation for max time taken as derived from y=ut + 0.5at**2 + h
    t = (-u_y - np.sqrt(u_y**2 + 2*a*-h)) / a

    #generates a range of values from 0 to t by step dt (0.01)
    times = np.arange(0, t, dt)

    #x is an array of initial velocity * each value of times
    x = u_x * times
    #y is the same but taking into account gravitational acceleration
    y = h + (u_y * times) + (0.5 * a * times**2)
    return x, y, None

# x, y = get_values()
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.plot(x, y)
# plt.show()