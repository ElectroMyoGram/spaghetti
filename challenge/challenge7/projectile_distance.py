import numpy as np
import matplotlib.pyplot as plt

max_points = []
min_points = []

def get_values(g=9.8, u=10, h=5):
    max_points = []
    min_points = []
    thetas = np.deg2rad([30, 45, 60, 70.5, 78, 85])

    dt = 0.01

    return_values = []

    for angle in thetas:
        R = (u**2 / g) * (np.sin(angle) * np.cos(angle) + np.cos(angle) * np.sqrt((np.sin(angle) ** 2) + (2 * g * h / (u**2))))
        T = R / (u * np.cos(angle))

        times = np.arange(0, T, dt)

        x = u * np.cos(angle) * times
        y = h + (x * np.tan(angle)) - ((g / (2 * u**2)) * (1 + np.tan(angle) ** 2) * x**2)
        r = np.sqrt(u**2 * times**2 - (g*times**3*u*np.sin(angle)) + (0.25 * g**2 * times**4))


        local_max, local_min = None, None
        local_max_x, local_max_y, local_min_x, local_min_y, local_max_r, local_min_r = None, None, None, None, None, None
        if angle >= np.arcsin((2 * np.sqrt(2)) / 3):
            local_min = (3*u / (2*g)) * (np.sin(angle) + np.sqrt(np.sin(angle)**2 - (8/9)))
            local_max = (3*u / (2*g)) * (np.sin(angle) - np.sqrt(np.sin(angle)**2 - (8/9)))
            local_max_x = u * np.cos(angle) * local_max
            local_max_y = h + (local_max_x * np.tan(angle)) - ((g / (2 * u**2)) * (1 + np.tan(angle) ** 2) * local_max_x**2)
            local_min_x = u * np.cos(angle) * local_min
            local_min_y = h + (local_min_x * np.tan(angle)) - ((g / (2 * u**2)) * (1 + np.tan(angle) ** 2) * local_min_x**2)
            local_max_r = np.sqrt(u**2 * local_max**2 - (g*local_max**3*u*np.sin(angle)) + (0.25 * g**2 * local_max**4))
            local_min_r = np.sqrt(u**2 * local_min**2 - (g*local_min**3*u*np.sin(angle)) + (0.25 * g**2 * local_min**4))

        return_values.append((x, y, times, r, angle))
        max_points.append((local_max_x, local_max_y, local_max, local_max_r))
        min_points.append((local_min_x, local_min_y, local_min, local_min_r))



        
        # plt.subplot(2, 1, 1)
        # plt.plot(x, y, label=f'θ={np.round(np.rad2deg(angle), 1)}', linewidth=1)
        # if local_max:
        #     print(times)
        #     plt.scatter(local_max_x, local_max_y, s=10)
        #     plt.scatter(local_min_x, local_min_y, s=10)

        # plt.subplot(2, 1, 2)
        # plt.plot(times, r, label=f'θ={np.round(np.rad2deg(angle), 1)}', linewidth=1)
        # if local_max:
        #     plt.scatter(local_max, local_max_r, s=10)
        #     plt.scatter(local_min, local_min_r, s=10)


    return (return_values, get_max_points(max_points), get_min_points(min_points))

    # plt.subplot(2, 1, 1)
    # plt.legend(title='angle')
    # plt.subplot(2, 1, 2)
    # plt.legend(title='angle')
    # plt.xlabel('x /m')
    # plt.ylabel('y / m')
    # plt.show()

def get_max_points(max_points):
    max_x_points = [max_points[k][0] for k in range(len(max_points))]
    max_y_points = [max_points[k][1] for k in range(len(max_points))]
    max_t_points = [max_points[k][2] for k in range(len(max_points))]
    max_r_points = [max_points[k][3] for k in range(len(max_points))]
    return (max_x_points, max_y_points, max_t_points, max_r_points)

def get_min_points(min_points):
    min_x_points = [min_points[k][0] for k in range(len(min_points))]
    min_y_points = [min_points[k][1] for k in range(len(min_points))]
    min_t_points = [min_points[k][2] for k in range(len(min_points))]
    min_r_points = [min_points[k][3] for k in range(len(min_points))]
    return (min_x_points, min_y_points, min_t_points, min_r_points)


