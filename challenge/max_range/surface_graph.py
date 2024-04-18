import matplotlib.pyplot as plt
import numpy as np

from matplotlib import cm
from matplotlib.ticker import LinearLocator


g = 9.81

u = np.arange(0, 50, 0.25)
h = np.arange(0, 50, 0.25)
u, h = np.meshgrid(u, h)

r = (u**2 / g) * np.sqrt(1 + ((2 * g * h) / u**2))

plt.figure(figsize=(8, 6))
color_map = plt.pcolormesh(u, h, r, shading='auto', cmap='jet')

plt.colorbar(color_map)
plt.xlabel('u /ms-1')
plt.ylabel('h /m')

theta = np.sin(1 / np.sqrt(2 + (2*g*h) / u**2))

plt.figure(figsize=(8, 6))
color_map = plt.pcolormesh(u, h, theta, shading='auto', cmap='jet')

plt.colorbar(color_map)
plt.xlabel('u / ms-1')
plt.ylabel('h /m')

RgOverUsqared =  np.sqrt(1 + (2 * g * h) / u**2)
plt.figure(figsize=(8, 6))
color_map = plt.pcolormesh(u, h, RgOverUsqared, shading='auto', cmap='jet', vmin=0.0, vmax=10.0)
plt.colorbar(color_map)

plt.show()