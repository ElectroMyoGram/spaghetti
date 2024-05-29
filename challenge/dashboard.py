import challenge1.constantAcceleration as c1
import challenge2.analyticModel as c2
import challenge3.trajectoryCalculator as c3
import challenge4.maximumhorizontalrange as c4
import challenge5.bounding as c5
import challenge7.projectile_distance as c7
import challenge8.bouncing_ball as c8
import challenge9.air_resistance as c9
import ISAatmosphere.air_density as atmosphere
import ISAatmosphere.air_resistance_map as atmosphere_heatmap

import dash
from dash import dcc, html, no_update
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, ALL, State, MATCH, ALLSMALLER
import plotly.graph_objs as go
from plotly.subplots import make_subplots

import numpy as np



#boring stuff for creating the app blahblhabla
app = dash.Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])


app.layout = html.Div([
    dcc.Tabs(id='tabs', value='tab_1', children=[
        dcc.Tab(label='Tasks', value='tab_1'),
        dcc.Tab(label='Extension', value='tab_2'),
        dcc.Tab(label='Extension 2', value='tab_3')
    ]), html.Div(id='tab_content')
])

#i know these are global variables :( shush i do what I want
targetx, targety = 9, 0
air_density = 0

#just the layout of tab1
def get_tab_1_content():
    return html.Div([
        #title
        html.H1("Projectile Motion", style={'text-align': 'center'}),

        #dropdown for selecting tasks
        dcc.Dropdown(id={'type': 'slct_task', 'index': 0},
                    options=[
                        {"label": "Task 1", "value": 1},
                        {"label": "Task 2", "value": 2},
                        {"label": "Task 3", "value": 3},
                        {"label": "Task 4", "value": 4},
                        {"label": "Task 5", "value": 5},
                        {"label": "Task 6", "value": 6},
                        {"label": "Task 7", "value": 7},
                        {"label": "Task 8", "value": 8},
                        {"label": "Task 9", "value": 9},
                        {"label": "Extension", "value": 10}],
                        multi=False,
                        value=1,
                        style={'width': "40%"}),

        #empty box for buggy purpose       
        html.Div(id={'type': 'output_container', 'index': 0}, children=[]),
        html.Br(),

        #adds a graph in dash
        dcc.Graph(id={'type': 'plot', 'index': 0}, figure={'layout': {'clickmode': 'event+select'}}, config={'staticPlot': False}),
        #html div for displaying all the parameters
        html.Div(id='Options',children=[
            #initial velocity slider
            html.Div(id={'type': 'u_container', 'index': 0},children=[
                html.Label("Initial Velocity"),

                dcc.Slider(
                id={'type': 'u', 'index': 0},
                min = 0,
                max = 50,
                value = 10
                )],
                style={'display': 'block'}),
            #more sliders
            html.Div(id={'type': 'high/low_v_container', 'index': 0},children=[
                html.Label("High/Low ball additional velocity"),

                dcc.Slider(
                id={'type': 'high/low_v', 'index': 0},
                min = 0,
                max = 10,
                value = 1
                )],
                style={'display': 'none'}),

            #more sliders
            html.Div(id={'type': 'g_container', 'index': 0},children=[
                html.Label("Gravitational Acceleration"),

                dcc.Slider(
                id={'type': 'g', 'index': 0},
                min = 0,
                max = 100,
                value = 9.8
                )],
                style={'display': 'block'}),

            #more sliders theta=angle of launch
            html.Div(id={'type': 'theta_container', 'index': 0},children=[
                html.Label("Start Angle (degrees)"),

                dcc.Slider(
                id={'type': 'theta', 'index': 0},
                min = 0,
                max = 90,
                value = 60
                )],
                style={'display': 'block'}),

            #more sliders - C = constant of restitution for bouncing businesses
            html.Div(id={'type': 'C_container', 'index': 0},children=[
                html.Label("Constant of Restitution"),

                dcc.Slider(
                id={'type': 'C', 'index': 0},
                min = 0,
                max = 1,
                value = 0.7
                )],
                style={'display': 'block'}),
            
            #starting height slider
            html.Div(id={'type': 'h_container', 'index': 0},children=[
                html.Label("Starting Height"),

                dcc.Slider(
                id={'type': 'h', 'index': 0},
                min = 0,
                max = 50,
                value = 0.7
                )],
                style={'display': 'block'})
        ])
        # html.Div(children=[dcc.Checklist(['Target Location'], id={'type': 'target_location', 'index': 0})], style={'display': 'none'})



    ])

#layout of tab 2
def get_tab_2_content():
   return html.Div([
       #title for tab 2
        html.H1("Extension Projectile", style={'text-align': 'center'}),

        #same weird div that i need to have
        html.Div(id={'type': 'output_container', 'index': 1}, children=[]),     
        html.Br(),

        #row for aligning both parameters and plot side by side
        dbc.Row([
            #graph
            dbc.Col(dcc.Graph(id={'type': 'plot', 'index': 1}, figure={'layout': {'clickmode': 'event+select'}}, config={'staticPlot': False}), width=8),
            
            #parameters sliders
            dbc.Col(html.Div(id={'type': 'parameters', 'index': 1}, children=[
                        #sliders
                        html.Div(id={'type': 'u_container', 'index': 1},children=[
                            html.Label("Initial Velocity"),

                            dcc.Slider(
                            id={'type': 'u', 'index': 1},
                            min = 0,
                            max = 50,
                            value = 10
                            )],
                            style={'display': 'block'}),
                        #sliders
                        html.Div(id={'type': 'g_container', 'index': 1},children=[
                            html.Label("Gravitational Acceleration"),

                            dcc.Slider(
                            id={'type': 'g', 'index': 1},
                            min = 0,
                            max = 100,
                            value = 9.8
                            )],
                            style={'display': 'block'}),
                        #more sliders
                        html.Div(id={'type': 'theta_container', 'index': 1},children=[
                            html.Label("Start Angle (degrees)"),

                            dcc.Slider(
                            id={'type': 'theta', 'index': 1},
                            min = 0,
                            max = 90,
                            value = 60
                            )],
                            style={'display': 'block'}),
                        #more sliders
                        html.Div(id={'type': 'h_container', 'index': 1},children=[
                            html.Label("Starting Height"),

                            dcc.Slider(
                            id={'type': 'h', 'index': 1},
                            min = 0,
                            max = 50,
                            value = 0.7
                            )],
                            style={'display': 'block'}),
                        #more sliders
                        html.Div(children=[
                            dcc.Checklist(['Target Location'], id={'type': 'target_location', 'index': 1}),
                            html.Div(id={'type': 'target_container', 'index': 1}, children=[
                                dcc.Input(id={'type': 'target_location_x', 'index': 1}, type='number', placeholder='X position'),
                                dcc.Input(id={'type': 'target_location_y', 'index': 1}, type='number', placeholder='Y position')
                            ], style={'dipslay': 'none'})
                            ]),
                        #more sliders
                        html.Div(children=[
                            dcc.Checklist(['Air Resistance'], id={'type': 'air_resistance_check', 'index': 1}),
                            html.Div(id={'type': 'air_resistance_parameters', 'index': 1}, children=[
                                dcc.Dropdown(id = {'type': 'constant/atmospheric-air-resistance-check', 'index': 1}, 
                                options=[
                                    {'label': 'Constant Air Density', 'value': 1},
                                    {'label': 'Atmospheric Air Density', 'value': 2}
                                ],
                                multi=False,),
                                
                                html.Div(children=[
                                    html.Label('Air Density:'),
                                    dcc.Input(id={'type': 'air_density_input', 'index': 1}, type='number'),
                                ], id={'type': 'air_density_input_container', 'index': 1}),

                                html.Div(children=[
                                    html.Label('Multiplier:'),
                                    dcc.Slider(
                                    id={'type': 'atmospheric_multiplier_input', 'index': 1}, 
                                    min = 1,
                                    max = 10000,
                                    value=1000),
                                ], id={'type': 'atmospheric_multiplier_container', 'index': 1})

                                # dcc.Input(id={'type': 'atmospheric_input', 'index': 1}, type='number', style={'display': 'none'})

                            ])
                        ])
                    ]),
                width=4,
                )
            ]
        )
    ])

#content for tab 3
def get_tab_3_content():
    return html.Div([
        html.H1("The Earth lol"),

        html.Div(id='three-js-container'),

        html.Iframe(src='/assets/3d-components/index.html', style={"height": "400px", "width": "100%"})
    ])


#used to render whether the tab is 1 or 2
@app.callback(
        Output(component_id='tab_content', component_property='children'),
        [Input(component_id='tabs', component_property='value')]
)
def render_tabs(tab):
    match tab:
        case 'tab_1':
            return get_tab_1_content()
        case 'tab_2':
            return get_tab_2_content()
        case 'tab_3':
            return get_tab_3_content()


#renders the different parameters (sets them to visible or invisible)
@app.callback(
        [Output(component_id={'type': 'u_container', 'index': MATCH}, component_property='style'),
        Output(component_id={'type': 'theta_container', 'index': MATCH}, component_property='style'),
        Output(component_id={'type': 'high/low_v_container', 'index': MATCH}, component_property='style'),
        Output(component_id={'type': 'C_container', 'index': MATCH}, component_property='style')],
        [Input(component_id={'type': 'slct_task', 'index': MATCH}, component_property='value')]
)
def render_parameters(task):
    u_container = {'display': 'block'}
    theta_container = {'display': 'block'}
    high_low_v_container = {'display': 'none'}
    C_container = {'display': 'none'}
    
    #essentially just sets the display of each slider depending on the current task
    match task:
        case 3:
            u_container = {'display': 'none'}
            high_low_v_container = {'display': 'block'}
        case 7:
            theta_container = {'display': 'none'}
        case 8:
            C_container = {'display': 'block'}
    

    return u_container, theta_container, high_low_v_container, C_container

#used to render tab 2 graphs
@app.callback(
        [Output(component_id={'type': 'target_container', 'index': MATCH}, component_property='style'),
         Output(component_id={'type': 'target_location_x', 'index': MATCH}, component_property='value'),
         Output(component_id={'type': 'target_location_y', 'index': MATCH}, component_property='value'),
         Output(component_id={'type': 'air_resistance_parameters', 'index': MATCH}, component_property='style'),
         Output(component_id={'type': 'air_density_input', 'index': MATCH}, component_property='value'),
         Output(component_id={'type': 'air_density_input_container', 'index': MATCH}, component_property='style'),
         Output(component_id={'type': 'atmospheric_multiplier_container', 'index': MATCH}, component_property='style')
         ],
        [Input(component_id={'type': 'target_location', 'index': ALL}, component_property='value'),
         Input(component_id={'type': 'air_resistance_check', 'index': ALL}, component_property='value'),
         Input(component_id={'type': 'constant/atmospheric-air-resistance-check', 'index': MATCH}, component_property='value'),]
)
def render_tab_2_parameters(target_pos, air_resistance, constant_air_density_check):
    global targetx, targety


    #renders each paramet depending on some checkboxes eg target_pos and if air_resistance
    target_container_style = {'display': 'block'}
    air_resistance_style = {'display': 'none'}
    constant_air_resistance_val = 0
    constant_air_resistance_style = {'display': 'none'}
    atmospheric_multiplier_style = {'display': 'none'}
    
    if len(target_pos) == 0 or target_pos == [None] or target_pos == [[]]:
        target_container_style = {'display': 'none'}
        targetx, targety = None, None
    if len(air_resistance) != 0 and air_resistance != [None] and air_resistance != [[]]:
        air_resistance_style = {'display': 'block'}
        match constant_air_density_check:
            case 1:
                constant_air_resistance_style = {'display': 'block'}
            case 2:
                atmospheric_multiplier_style = {'display': 'block'}
    else:
        constant_air_resistance_val = None

    return target_container_style, targetx, targety, air_resistance_style, constant_air_resistance_val, constant_air_resistance_style, atmospheric_multiplier_style


#used to render all graphs - callbacks basically take inputs and outputs of all the different components used in def update_tab_graphs(...)
@app.callback(
    [Output(component_id={'type': 'output_container', 'index': MATCH}, component_property='children'),
     Output(component_id={'type': 'plot', 'index': MATCH}, component_property='figure'),
     Output(component_id={'type': 'u', 'index': MATCH}, component_property='value'),
     Output(component_id={'type': 'theta', 'index': MATCH}, component_property='value'),
     ],

    [Input(component_id='tabs', component_property='value'),
     Input(component_id={'type': 'slct_task', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'u', 'index': MATCH}, component_property='drag_value'),
     Input(component_id={'type': 'g', 'index': MATCH}, component_property='drag_value'),
     Input(component_id={'type': 'theta', 'index': MATCH}, component_property='drag_value'),
     Input(component_id={'type': 'high/low_v', 'index': ALL}, component_property='drag_value'),
     Input(component_id={'type': 'C', 'index': ALL}, component_property='drag_value'),
     Input(component_id={'type': 'h', 'index': MATCH}, component_property='drag_value'),
     Input(component_id={'type': 'plot', 'index': MATCH}, component_property='clickData'),
     Input(component_id={'type': 'target_location_x', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'target_location_y', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'air_resistance_check', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'air_density_input', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'constant/atmospheric-air-resistance-check', 'index': ALL}, component_property='value'),
     Input(component_id={'type': 'atmospheric_multiplier_input', 'index': ALL}, component_property='value'),
     ]
)
def update_tab_graphs(tab, task_values, initial_v, gravity, theta, high_low_v_values, C_values, h, clickData, targetx, targety, air_resistance_check, air_density, constant_atmosphere_check, atmospheric_multiplier):
    if tab=='tab_1':
        #returns the tab1graphs values
        task=task_values[0] if task_values else no_update
        h_l_v = high_low_v_values[0] if high_low_v_values else no_update
        C = C_values[0] if C_values else no_update

        return update_tab1_graphs(task, initial_v, gravity, theta, h_l_v, C, h, clickData)
    elif tab=='tab_2':
        #otherwise returns the tab2 values

        #for setting a target for the projectile
        tx = targetx[0] if targetx != [] and targetx != [None] else None
        ty = targety[0] if targety != [] and targety != [None] else None
        

        return update_tab_2_graphs(initial_v, gravity, theta, h, clickData, tx, ty, air_resistance_check, air_density, constant_atmosphere_check, atmospheric_multiplier)
    else:
        return no_update, no_update, no_update, no_update

#used to update tab1
def update_tab1_graphs(task, initial_v, gravity, theta, high_low_v, C, h, clickData):
    #creates a graph figure
    fig = go.Figure()
    lines = []
    title = html.H2(f"Task {task}", style={'text-align': 'center'})

    # xlim = 45
    # ylim = 15
    #renders graph lines depending on task
    match task:
        case 1:
            lines.append([c1.get_values(u=initial_v, g=gravity, theta=np.deg2rad(theta), h=h)])
        case 2:
            lines.append([c2.get_values(u=initial_v, g=gravity, theta=np.deg2rad(theta), h=h)])
        case 3:
            #task 3 uses clicking to mark target point so some setup for that
            fig.add_trace(go.Scatter(x=np.repeat(np.linspace(0, 100, 20), 20), y=np.tile(np.linspace(0, 60, 20), 20), mode='markers', marker=dict(opacity=0), showlegend=False))

            targetx, targety = 100, 30
            if clickData:
                x = clickData['points'][0]['x']
                y = clickData['points'][0]['y']
                
                targetx, targety = x, y
            fig.add_trace(go.Scatter(x=[targetx], y=[targety], mode='markers', name='Target Position'))
            
            for line in c3.get_values(g=gravity, targetx=targetx, targety=targety, extra_v=high_low_v, h=h)[0]:
                lines.append([line])

            # xlim = 100
            # ylim = 70
        
        case 4:
            for line in c4.get_values(g = gravity, u = initial_v, theta=np.deg2rad(theta), h=h):
                lines.append([line])
        case 5:
            for line in c4.get_values(g = gravity, u = initial_v, theta=np.deg2rad(theta), h=h):
                lines.append([line])
            lines.append([c5.get_values(g=gravity, u=initial_v, h=h)])
        case 6:
            #multiple lines in case 6 so some extra stuff for that
            for line in c4.get_values(g = gravity, u = initial_v, theta=np.deg2rad(theta), h=h):
                angle = float(line[2][0:4])
                s = c4.calculate_distance(g=gravity, u=initial_v, theta=np.deg2rad(angle), x=max(line[0]))
                line[2] += f' Total Distance covered by projectile: {np.round(s, 2)}'
                lines.append([line])
        case 7:
            #case 7 involves multiple graphs so thats why its so messy
            fig = make_subplots(1, 2)
            c7values = c7.get_values(g=gravity, u=initial_v, h=h)
            for x, y, t, r, angle in c7values[0]:
                fig.add_trace(go.Scatter(x=x, y=y, mode='lines', name=np.round(np.rad2deg(angle),2)), row=1, col=1)
                fig.add_trace(go.Scatter(x=t, y=r, mode='lines', name=np.round(np.rad2deg(angle),2)), row=1, col=2)

            (min_x, min_y, min_t, min_r) = c7values[2]
            (max_x, max_y, max_t, max_r)= c7values[1]


            fig.add_trace(go.Scatter(x=max_x, y=max_y, mode='markers', name='Local Max'), row=1, col=1)
            fig.add_trace(go.Scatter(x=max_t, y=max_r, mode='markers', name='Local Max'), row=1, col=2)
            fig.add_trace(go.Scatter(x=min_x, y=min_y, mode='markers', name='Local Min'), row=1, col=1)
            fig.add_trace(go.Scatter(x=min_t, y=min_r, mode='markers', name='Local Min'), row=1, col=2)     

            fig.update_xaxes(title_text="X (m)", row=1, col=1)
            fig.update_yaxes(title_text="Y (m)", row=1, col=1)

            # Set titles for the axes of the second subplot
            fig.update_xaxes(title_text="T (s)", row=1, col=2)
            fig.update_yaxes(title_text="R (m)", row=1, col=2)


            return title, fig, initial_v, theta
        case 8:
            
            xpos, ypos = c8.get_values(gIN=gravity, u=initial_v, theta=np.deg2rad(theta), C=C, h=h)
            fig = c8.build_animation(xpos, ypos)

            return title, fig, initial_v, theta
        case 9:
            for line in c9.get_values(g=gravity, u=initial_v, theta=np.deg2rad(theta), h=h):
                lines.append([line])
            fig.layout.yaxis.rangemode = 'tozero'
            # ylim=40
            # xlim=100

    for line in lines:
        for x, y, name in line:
            trace = go.Scatter(x=x, y=y, mode='lines ', name=name)
            fig.add_trace(trace)
    
    # if xlim:
    #     fig.update_layout(xaxis_range=[0, xlim], xaxis_title='X (m)', yaxis_title='Y (m)')
    # if ylim:
    #     fig.update_layout(yaxis_range=[0, ylim])
    
    fig.update_layout(clickmode='event+select')
    fig.update_layout(xaxis_title="X (m)", yaxis_title="Y (m)")

    return title, fig, initial_v, theta

#used to update tab 2
def update_tab_2_graphs(initial_v, gravity, theta, h, clickData, targetx, targety, air_resistance_check, air_density, constant_atmosphere_check, atmospheric_multiplier):
    #creates graph
    fig = go.Figure()

    #establish some variables blahblah
    v_new=initial_v
    theta_new = theta
    ad = None
    #air density input is basically a list of all previous inputs so needs to take the most recent - for setting air density with air resistance

    if air_resistance_check == [['Air Resistance']]:
        print(air_resistance_check)
        graph_size = 1.25
        match constant_atmosphere_check[0]:
            case 1:
                if air_density != []:
                    ad = air_density[0]
                    advalues= c9.get_values(g=gravity, u=initial_v, theta=np.deg2rad(theta), h=h, air_density=ad)
                    x2, y2, _ = advalues[1]
                    fig.add_trace(go.Scatter(x=x2, y=y2, name='Air resistance model'))

            case 2:
                ad = atmosphere.get_values()
                advalues= c9.get_values(g=gravity, u=initial_v * atmospheric_multiplier[0], theta=np.deg2rad(theta), h=h, air_density=ad, atmosphere=True)
                fig = atmosphere_heatmap.get_values(ad[0], ad[1], max(advalues[1][0])*graph_size, max(advalues[1][1])*graph_size)
                
                x2, y2, _ = advalues[1]
                x, y, _ = advalues[0]
                fig.add_trace(go.Scatter(x=x2, y=y2, name='Air resistance model'))
                fig.add_trace(go.Scatter(x=x, y=y, name='No air resistance model'))
                fig.update_xaxes(range=[0, max(x2)*graph_size])
                fig.update_yaxes(range=[0, max(y2)*graph_size])
                fig.update_layout(xaxis_title="X (m)", yaxis_title="Y (m)")

                return no_update, fig, v_new, theta_new
    
    #if there are targets selected:
    if targetx != None and targety != None:
        fig.add_trace(go.Scatter(x=[targetx], y=[targety], mode='markers', name='Target Position'))
        
        values, v_new, theta_new = c3.get_values(g=gravity, targetx=targetx, targety=targety, extra_v=0, h=h)
        x, y, _ = values[0]
        theta_new = np.rad2deg(theta_new)
        
    else:
        x, y, _ = c2.get_values(u=initial_v, g=gravity, theta=np.deg2rad(theta), h=h)

    fig.add_trace(go.Scatter(x=x, y=y, name='No air-resistance projectile'))
    fig.update_layout(xaxis_title="X (m)", yaxis_title="Y (m)")
    return no_update, fig, v_new, theta_new

#run app
if __name__ == '__main__':
    app.run_server(debug=True)