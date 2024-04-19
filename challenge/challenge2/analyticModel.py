import numpy as np
import matplotlib.pyplot as plt

#more precise model of the same trajectory


def get_values(u = 20, g=9.8, theta=np.deg2rad(42), h=2):
    #u = initial velocity
    #g= gravitational acceleration
    #theta = launch angle
    #h = starting height
    dt = 0.01

    #equation for max range of projectile R = u**2 / g * (sintheta * costheta + costheta * sqrt(sin**2theta + 2gh/u**2))
    R = (u**2 / g) * (np.sin(theta) * np.cos(theta) + np.cos(theta) * np.sqrt((np.sin(theta) ** 2) + (2 * g * h / (u**2))))
    #calculate projectile time until hit ground using the equation
    T = R / (u * np.cos(theta))

    #generates array of values ranging from 0 to maxTime differ by dt
    times = np.arange(0, T, dt)

    #x and y are arrays of each values relating to times ( numpy allows you to do this with vectorised arrays :) 
    x = u * np.cos(theta) * times
    y = h + (x * np.tan(theta)) - ((g / (2 * u**2)) * (1 + np.tan(theta) ** 2) * x**2)
    return x, y, None
# plt.scatter(x[np.where(y == max(y))], max(y))
# plt.ylim(0, max(y))
# plt.xlim(0, max(x))
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.plot(x, y)
# plt.show()