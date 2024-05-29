import plotly.graph_objs as go
import numpy as np


def get_values(h, rho, max_x, max_y):
    X = np.linspace(0, max_x, 50)
    Y = np.linspace(0, max_y, 50)
    X, Y = np.meshgrid(X, Y)
    Z = np.interp(Y, h, rho)
    
    fig = go.Figure()
    fig.add_trace(go.Heatmap(
        x=X[0], y=Y[:, 0], z=Z,
        colorscale='Viridis',
        opacity=0.5,
        name='ISA atmospheric model',
        colorbar=dict(
            x=-0.3,
            title='Air Density'
        )
    ))

    
    return fig
