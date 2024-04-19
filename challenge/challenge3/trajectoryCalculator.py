import numpy as np
import matplotlib.pyplot as plt

#calculates the starting conditions of a projectile in order to reach a target position

def get_values(g=9.81, targetx=100, targety=30, extra_v = 1, h=20):
    #g=gravitational acceleration
    #targetx and targety are the target points which are intended to hit
    #extra v is the extra velocity used for calculating a high ball and low ball
    #h = starting height
    #dt = time step
    dt = 0.01


    #set range of x values between 0 and the target location differing by 0.1
    x = np.arange(0, targetx, 0.1)


    #calculate minimum launch speed needed to reach the target location using the equation
    min_u = np.sqrt(g) * np.sqrt((targety-h) + np.sqrt(targetx**2 + (targety-h)**2))

    #calculates the angle of launch based on the minimum launch speed (just pluggin in equation)
    min_u_theta = np.arctan(((targety-h) + np.sqrt(targetx**2 + (targety-h)**2)) / targetx)

    #an array of values referring to the projectiles y position for each x position using the minimum speed (min_u) and launch angle (theta)
    min_u_y = h + (x * np.tan(min_u_theta)) - ((g / (2 * min_u**2)) * (1 + np.tan(min_u_theta)**2) * x**2)

    # plt.plot(x, min_u_y, label='Minimum speed angle', linewidth=1)


    # calculate high ball and low ball by simply adding initial velocity resulting in 2 possible angles of launch to reach the same target
    larger_u = min_u + extra_v

    #this stuff is math based where using quadratic equation a, b, c i would have t go through it with you sorry!
    a = (g / (2 * larger_u**2)) * (targetx**2)
    b = -targetx
    c = targety - h + ((g * targetx**2) / (2 * larger_u**2))

    discriminant = b**2 - (4 * a * c)
    maxtheta = np.arctan((-b + np.sqrt(discriminant)) / (2 * a))
    mintheta = np.arctan((-b - np.sqrt(discriminant)) / (2 * a))


    #eventually after maths you can calculate the y positions for a high ball and low ball as well as the minimum speed ball
    high_ball_y =  h + (x * np.tan(maxtheta)) - ((g / (2 * larger_u**2)) * (1 + np.tan(maxtheta)**2) * x**2)
    low_ball_y =  h + (x * np.tan(mintheta)) - ((g / (2 * larger_u**2)) * (1 + np.tan(mintheta)**2) * x**2)

    return ((x, min_u_y, 'Minimum Speed trajectory'), (x, high_ball_y, 'High Ball trajectory'), (x, low_ball_y, 'Low Ball trajectory')), min_u, min_u_theta
# plt.plot(x, high_ball_y, label="High ball", linewidth=1)
# plt.plot(x, low_ball_y, label="Low ball", linewidth=1)

# #calculate bounding parabola
# bounding_parabola_y = (larger_u**2 / (2 * g)) - ((g / (2 * larger_u **2)) * x**2)
# plt.plot(x, bounding_parabola_y, label='Bounding parabola', linewidth=1)

# plt.legend(title='Trajectory')
# plt.xlim(0, targetx)
# plt.xlabel('x /m')
# plt.ylabel('y / m')
# plt.grid(True)
# plt.show()