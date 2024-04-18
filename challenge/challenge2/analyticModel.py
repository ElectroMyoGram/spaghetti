import numpy as np
import matplotlib.pyplot as plt


def get_values(u = 20, g=9.8, theta=np.deg2rad(42), h=2):


    dt = 0.01

    R = (u**2 / g) * (np.sin(theta) * np.cos(theta) + np.cos(theta) * np.sqrt((np.sin(theta) ** 2) + (2 * g * h / (u**2))))
    T = R / (u * np.cos(theta))
    xmax = (u**2 / g) * np.sin(theta) * np.cos(theta)
    ymax = h + (u**2 / (2 * g)) * (np.sin(theta) ** 2)

    times = np.arange(0, T, dt)

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