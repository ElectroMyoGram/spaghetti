import numpy as np
import matplotlib.pyplot as plt

#you can calculate a bounding parabola/curve along projectiles by using the equations
def get_values(g=9.81, u=10, h=2):
    #g = gravitational acceleration
    #u = initial velocity
    #h = starting height
    dt = 0.01

    #targets for the projectile to reach
    targetx, targety = 1000, 300
    # plt.scatter(targetx, targety)

    x = np.arange(0, targetx)


    #calculate minimum launch speed
    min_u = np.sqrt(g) * np.sqrt((targety-h) + np.sqrt(targetx**2 + (targety-h)**2))

    #caculate 2 different angles based on minimum launch speed
    min_u_theta0 = np.arctan(((targety-h) + np.sqrt(targetx**2 + (targety-h)**2)) / targetx)
    min_u_theta1 = np.arctan(((targety-h) - np.sqrt(targetx**2 + (targety-h)**2)) / targetx)
    #this is technically irrelevant but picks one of the 2 possible angles by checking for the difference 
    if targety - h >= 0:
        min_u_theta = min_u_theta0
    else:
        min_u_theta = min_u_theta1

    # min_u_y = h + (x * np.tan(min_u_theta)) - ((g / (2 * min_u**2)) * (1 + np.tan(min_u_theta)**2) * x**2)

    # plt.plot(x, min_u_y, label='Minimum speed angle', linewidth=1)


    # calculate high ball and low ball using quadratic equation - hence a, b, c maths stuff
    larger_u = min_u + 10
    a = (g / (2 * larger_u**2)) * (targetx**2)
    b = -targetx
    c = targety - h + ((g * targetx**2) / (2 * larger_u**2))

    discriminant = b**2 - (4 * a * c)
    maxtheta = np.arctan((-b + np.sqrt(discriminant)) / (2 * a))
    mintheta = np.arctan((-b - np.sqrt(discriminant)) / (2 * a))
    
    #we've seen this before :)
    high_ball_y =  h + (x * np.tan(maxtheta)) - ((g / (2 * larger_u**2)) * (1 + np.tan(maxtheta)**2) * x**2)
    low_ball_y =  h + (x * np.tan(mintheta)) - ((g / (2 * larger_u**2)) * (1 + np.tan(mintheta)**2) * x**2)

    # plt.plot(x, high_ball_y, label="High ball", linewidth=1)
    # plt.plot(x, low_ball_y, label="Low ball", linewidth=1)

    #calculate bounding parabola using equation
    bounding_parabola_y = (u**2 / (2 * g)) - ((g / (2 * u **2)) * x**2) + h
    # plt.plot(x, bounding_parabola_y, label='Bounding parabola', linewidth=1)
    return x, bounding_parabola_y, 'Bounding parabola'

# plt.legend(title='Trajectory')
# plt.xlim(0, targetx)
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.show()