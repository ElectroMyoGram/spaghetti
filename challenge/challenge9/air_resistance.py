import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle


def get_values(g=9.81, u=30, theta=np.deg2rad(45), h=2, air_density=1):
    dt = 0.01

    drag_coefficient = 0.1
    cross_sectional_area = 0.001
    m = 0.01


    v_y = np.sin(theta) * u
    v_x = np.cos(theta) * u

    v2_y = np.sin(theta) * u
    v2_x = np.cos(theta) * u
    v2 = u
    x_pos, y_pos = 0, h
    x2_pos, y2_pos = 0, h

    ax2, ay2 = 0, 0


    print(air_density)
    k = (0.5 * drag_coefficient * air_density * cross_sectional_area) / m

    x1, x2, y1, y2 = [], [], [], []

    while y2_pos >= 0:

        ax2 = -(v2_x / v2) * k * v2**2
        ay2 = -g - ((v2_y / v2) * k * v2**2)


        x_pos += v_x * dt
        y_pos += v_y * dt - (0.5 * g * dt**2)

        x2_pos += v2_x * dt + (0.5 * ax2 * dt**2)
        y2_pos += v2_y * dt + (0.5 * ay2 * dt**2)

        v2_x += ax2 * dt
        v2_y += ay2 * dt

        v_y -= g * dt

        v2 = np.sqrt(v2_x**2 + v2_y**2)

        y1.append(y_pos)
        x1.append(x_pos)

        y2.append(y2_pos)
        x2.append(x2_pos)

    return ((x1, y1, "No air resistance"),(x2, y2, "Air resistance"))
# plt.plot(x1, y1, linewidth=1)
# plt.plot(x2, y2, linewidth=1)

# plt.xlim(0, max(x1))
# plt.ylim(0, max(y1))
# plt.xlabel('x /m')
# plt.ylabel('y /m')
# plt.show()


