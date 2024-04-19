import numpy as np
import matplotlib.pyplot as plt


#takes an initial velocity and then calculates the maximum range it could reach depending on what angle you shoot if from
#also calculates the distance which the projectile travels


#function for calculating the distance travelled by ball 
def calculate_distance(g,u, theta, x):
        #basically this is all really complicated maths that I'd have to go through using some wierd integral calculated
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
    #g = gravitional acceleration
    #u = initial velocity
    #h = starting height
    #theta = angle of launch
    #dt = timestep (delta time)
    dt = 0.01

    #just a function for returning and array of y values of a trajectory given an array of corresponding x values and a launch angle, and initial velocity
    def trajectory(x, theta, u):
        return h + (x * np.tan(theta)) - (g/(2*u**2)) * (1 + np.tan(theta)**2) * x**2

    #this does the same thing as calculate_distance() but uses a numerical method rather than mathematical method
    def numeric_approximation(X, theta, u, dx):
        def f(x):
            return h + (x * np.tan(theta)) - (g/(2*u**2)) * (1 + np.tan(theta)**2) * x**2
        if X <= dx:
            return 0
        
        dy = f(X) - f(X-dx)
        return numeric_approximation(X-dx, theta, u, dx) + np.sqrt(1+(dy/dx)**2)*dx


    #uses equation to calculate maximum range of projectile
    R = (u**2 / g) * (np.sin(theta) * np.cos(theta) + np.cos(theta) * np.sqrt((np.sin(theta) ** 2) + (2 * g * h / (u**2))))
    #then calculate maximum Time before hitting ground using maximum range
    T = R / (u * np.cos(theta))

    #creates a list of values of times differing by dt (does the same as np.arange())
    times = np.linspace(0, T, int(1 / dt), endpoint=True)

    #list of x values corresponding to the projectiles x location at a given time
    x = u * np.cos(theta) * times
    #returns list of y values corresponding to list of x values for the projectiles motion
    y = trajectory(x, theta, u)

    #s is the total distance that the projectile travels along the parabola
    s = calculate_distance(g, u, theta, max(x))
    # plt.plot(x, y, label=f"θ={np.round(theta, 2)}. T={np.round(T, 2)}s. s={np.round(s, 2)}")



    #now we calculate the maximum distance a projectile could cover given a starting velocity - by working out the starting angle
    #calculate maximum horizontal range for second projectile
    R2 = (u**2 / g) * np.sqrt(1 + (2*g*h / (u**2)))
    #calculates angle required in order for the projectile to cover the maximum distance
    max_dist_theta = np.arcsin(1 / np.sqrt(2 + (2 * g * h / (u**2))))

    #again creating a bunch of times used for plotting everything
    T2 = R2 / (u * np.cos(max_dist_theta))
    times = np.linspace(0, T2, int(1/dt), endpoint=True)

    #I think you get the idea!
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