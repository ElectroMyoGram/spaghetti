import numpy as np
import matplotlib.pyplot as plt


def calculate_distance(g,u, theta, x):
        z = np.tan(theta)

        term1 = (u**2) / (g * (1 + np.tan(theta)**2))
        term2 = 0.5 * np.log(np.abs(np.sqrt(1 + z**2) + z)) + 0.5 * z * np.sqrt(1 + z**2)

        d = (g*x / (u**2)) * (1 + np.tan(theta)**2)

        z = np.tan(theta) - d
        term3 = (u**2) / (g * (1 + np.tan(theta)**2))
        term4 = 0.5 * np.log(np.abs(np.sqrt(1 + z**2) + z)) + 0.5 * z * np.sqrt(1 + z**2)

        s = term1 * term2 - term3*term4

        return s
def get_values(g=9.8, u=10, h=2, theta=np.deg2rad(60)):

    dt = 0.01

    def trajectory(x, theta, u):
        return h + (x * np.tan(theta)) - (g/(2*u**2)) * (1 + np.tan(theta)**2) * x**2



    def numeric_approximation(X, theta, u, dx):
        def f(x):
            return h + (x * np.tan(theta)) - (g/(2*u**2)) * (1 + np.tan(theta)**2) * x**2
        if X <= dx:
            return 0
        
        dy = f(X) - f(X-dx)
        return numeric_approximation(X-dx, theta, u, dx) + np.sqrt(1+(dy/dx)**2)*dx

    R = (u**2 / g) * (np.sin(theta) * np.cos(theta) + np.cos(theta) * np.sqrt((np.sin(theta) ** 2) + (2 * g * h / (u**2))))
    T = R / (u * np.cos(theta))


    times = np.linspace(0, T, int(1 / dt), endpoint=True)

    x = u * np.cos(theta) * times
    y = trajectory(x, theta, u)

    s = calculate_distance(g, u, theta, max(x))
    # plt.plot(x, y, label=f"θ={np.round(theta, 2)}. T={np.round(T, 2)}s. s={np.round(s, 2)}")


    #calculate maximum horizontal range
    R2 = (u**2 / g) * np.sqrt(1 + (2*g*h / (u**2)))
    max_dist_theta = np.arcsin(1 / np.sqrt(2 + (2 * g * h / (u**2))))

    T2 = R2 / (u * np.cos(max_dist_theta))
    times = np.linspace(0, T2, int(1/dt), endpoint=True)

    x2 = u * np.cos(max_dist_theta) * times
    y2 = h + (x2 * np.tan(max_dist_theta)) - ((g / (2 * u**2)) * (1 + np.tan(max_dist_theta) ** 2) * x2**2)

    s2 = calculate_distance(g, u, max_dist_theta, max(x2))
    # plt.plot(x2, y2, label=f"θ={np.round(max_dist_theta, 2)}. T={np.round(T2, 2)}s. s={np.round(s2, 2)}")
    return [[x, y, f'{np.round(np.rad2deg(theta), 2)} degrees'], [x2, y2, f'{np.round(np.rad2deg(max_dist_theta), 2)} degrees: maximum horizontal range ']]


# plt.legend(title='Initial trajectory vs maximum range')
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.plot(x, y)
# plt.show()