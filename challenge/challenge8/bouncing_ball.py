import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle

import plotly.graph_objs as go

#animates a bouncing ball - bounces each collision reduces momentum
def get_values(gIN=9.81, u=5, theta=np.deg2rad(45), C=0.7, h=10):
    
    dt = 0.05
    g = -gIN
    m = 1
    radius = 0.1

    #g = gravitional acceleration
    #u = initial velocity
    #theta = starting angle
    #C = constant of restitution
    #h = starting height

    #works out starting velocities for y and x based on u
    v_y = np.sin(theta) * u
    v_x = np.cos(theta) * u

    #starting x position and y position
    x_pos, y_pos = 0, h

    #number of bounces it will plot before stopping
    n_bounces = 6
    y = []
    x = []
    t = 0
    while n_bounces > 0:
        #uses SUVAT - iteratively updates positions, velocities
        x_pos += (v_x * dt)
        y_pos += (v_y * dt) + (0.5 * g * dt**2)
        v_y += g * dt

        #checks if collides with floor
        if y_pos <= 0:
            n_bounces -= 1
            #reduces velocity by constant of restitution
            v_y = -v_y * C
        
        #clips the y position above 0 so it doesn't break through floor
        y_pos = np.clip(y_pos, 0, 100)
        x.append(x_pos)
        y.append(y_pos)
        t+= dt
    return x, y

#this stuff just uses dash to then build the animation created
def build_animation(xpos, ypos):
    #creates graph
    fig = go.Figure(
        data = [
            go.Scatter(x=[xpos[0]], y=[ypos[0]], mode='markers', marker=dict(size=10)),
            go.Scatter(x=[xpos[0]], y=[ypos[0]], mode='lines+markers', name='Trajectory')],

        layout=go.Layout(
            xaxis=dict(range=[min(xpos), max(xpos)], autorange=False),
            yaxis=dict(range=[min(ypos), max(ypos)], autorange=False),
        )
    )
    frames = [go.Frame(data=[go.Scatter(x=[xpos[k]], y=[ypos[k]]), go.Scatter(x=xpos[:k], y=ypos[:k])]) for k in range(1, len(xpos))]
    fig.frames = frames

    fig.update_layout(
        updatemenus=[
            {
                "type": "buttons",
                "buttons": [
                    {
                        "label": "Play",
                        "method": "animate",
                        "args": [None, {"frame": {"duration": 1, "redraw": True}, "fromcurrent": True, "transition": {"duration": 0, "easing": "linear"}}],
                    }
                ]
            }
        ]
    )
    return fig
    
# fig, ax = plt.subplots()
# ax.set_aspect('equal')
# ax.set_xlim(min(x), max(x))
# ax.set_ylim(min(y), max(y))
# line = ax.plot(x[0], y[0])[0]

# ball1 = Circle((x_pos, y_pos), radius, color='r')
# ax.add_patch(ball1)
 
      
# n=0
# def update(frame):
#     global n
#     ball1.center = (x[n], y[n])
#     n+=1
#     line.set_xdata(x[:n])
#     line.set_ydata(y[:n])

#     return ball1,line

 
# ani = FuncAnimation(fig, update, frames=np.arange(0, t, dt), blit=True, interval=dt*1000)
 
# plt.show()

