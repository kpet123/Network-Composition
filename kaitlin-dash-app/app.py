import dash
import dash_core_components as dcc
import dash_html_components as html

app = dash.Dash(__name__)

app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
    </head>

    <body>
        <div>My Custom header</div>
	        {%app_entry%}
        <button type="button" id="myBtn" onclick="myFunction()">Try it</button>
		<script type="module">

import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";

import notebook from "https://api.observablehq.com/d/660ed25f1beeb456.js?v=3";


    console.log("My function is running");
    new Runtime().module(notebook, Inspector.into(document.body));
        


</script> 
       <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
        <div>My Custom footer</div>
    </body>
</html>
'''


app.layout = html.Div([
    html.Div(
        className="app-header",
        children=[
            html.Div('Plotly Dash', className="app-header--title")
        ]
    ),
    html.Div(
        children=html.Div([
            html.H5('Overview'),
            html.Div('''
                This is an example of a simple Dash app with
                local, customized CSS.
            ''')
        ])
    ), 
    html.Div(
        children=html.Div([
            html.H5('Demo'),
           ])
    ) 

])

if __name__ == '__main__':
    app.run_server(debug=True)

