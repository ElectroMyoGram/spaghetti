import numpy as np
import matplotlib.pyplot as plt


def get_values(u=20, g=9.8, theta=(0.25*np.pi), h=2):
    a = -g
    u_x = u * np.cos(theta)
    u_y = u * np.sin(theta)
    dt = 0.01

    t = (-u_y - np.sqrt(u_y**2 + 2*a*-h)) / a
    times = np.arange(0, t, dt)
    x = u_x * times
    y = h + (u_y * times) + (0.5 * a * times**2)
    return x, y, None

# x, y = get_values()
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.plot(x, y)
# plt.show()