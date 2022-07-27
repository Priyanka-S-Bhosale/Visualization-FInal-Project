import json

from flask import *
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

df = pd.read_csv('data/my_project_dataset.csv')
df_for_pcp = pd.read_csv('data/state_crime.csv')
df_for_radar = pd.read_csv('data/project_dataset.csv')

rate_filter = ['State', 'Year', 'Population', 'Rates-Burglary', 'Rates-Larceny', 'Rates-Motor', 'Rates-Assault',
               'Rates-Murder',
               'Rates-Rape', 'Rates-Robbery']
main_rate_data = df[rate_filter]

total_value_filter = ['State', 'Year', 'Population', 'Total-All', 'Total-Burglary', 'Total-Larceny', 'Totals-Motor',
                      'Total-Assault', 'Total-Murder',
                      'Total-Rape', 'Total-Robbery']
total_value_data = df[total_value_filter]

total_value_filter_for_pcp = ['State', 'Year', 'Population', 'All', 'Burglary', 'Larceny',
                              'Motor',
                              'Assault', 'Murder',
                              'Rape', 'Robbery']

total_value_data_for_pcp = df_for_pcp[total_value_filter_for_pcp]
total_value_data_for_radar = df_for_radar[total_value_filter]

print(total_value_data_for_pcp)

pcp_filter = ['State', 'Year', 'Total-Burglary', 'Total-Larceny', 'Totals-Motor',
              'Total-Assault', 'Total-Murder',
              'Total-Rape', 'Total-Robbery']
pcp_data = df[pcp_filter]


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/load_us_map', methods=["POST"])
def load_map():
    response = request.get_json()
    try:
        data = total_value_data[total_value_data['Year'] == int(response['Year'])].groupby('State')[
            response['Crime']].mean()
    except:
        data = total_value_data.groupby('State')[response['Crime']].mean()
    data = data.reset_index()
    data.to_dict()
    data = data.to_json()
    return jsonify(data)


@app.route('/parallel_coordinates_plot', methods=["POST"])
def load_pcp():
    result = request.get_json()
    state_data = total_value_data_for_pcp[total_value_data_for_pcp['State'] == result['State']]
    state_data = state_data[["Burglary", "Larceny", "Motor",
                             "Assault", "Murder",
                             "Rape", "Robbery"]]

    data = []
    dimensions = ['Burglary', 'Larceny', 'Motor',
                  'Assault', 'Murder',
                  'Rape', 'Robbery']
    data.append(state_data.to_dict(orient='records'))
    data.append(dimensions)

    kmeans = KMeans(n_clusters=3, random_state=0).fit(state_data)
    kMeansLabels = kmeans.labels_
    data.append(kMeansLabels.flatten().tolist())
    return json.dumps(data)


@app.route('/bar_chart', methods=["POST"])
def load_bar_chart():
    response = request.get_json()
    state_crime_data = total_value_data[total_value_data['State'] == response['State']]
    state_crime_data = state_crime_data[[response['Crime'], "Year"]]
    data = state_crime_data.reset_index()
    data.to_dict()
    data = data.to_json()
    return data


@app.route('/line_chart', methods=["POST"])
def load_line_chart():
    response = request.get_json()
    state_crime_data = total_value_data[total_value_data['State'] == response['State']]
    state_crime_data = state_crime_data[["Population", "Year"]]
    state_crime_data = state_crime_data.groupby("Year").mean()
    data = state_crime_data.reset_index()
    data.to_dict()
    data = data.to_json()
    return data


@app.route('/pie_chart', methods=["POST"])
def load_pie_chart():
    response = request.get_json()
    state_crime_data = total_value_data[total_value_data['State'] == response['State']]
    state_crime_data = state_crime_data.agg(
        {'Total-Burglary': 'sum', 'Total-Larceny': 'sum', 'Totals-Motor': 'sum', "Total-Assault": 'sum'})
    data = state_crime_data.reset_index()
    data.to_dict()
    data = data.to_json()
    print("PI CHART DATA :", data)
    return data


@app.route('/radar_chart', methods=["POST"])
def load_radar_chart():
    response = request.get_json()

    state_crime_data_p = total_value_data_for_radar[(total_value_data['Total-Murder']) &
                                                    (total_value_data_for_radar['State'] == response['State'])][
        ['Year', 'Population']].fillna(0)

    state_crime_data_p = state_crime_data_p[["Year", "Population"]]
    state_crime_data_p = state_crime_data_p.rename(columns={'Year': 'axis', 'Population': 'value'})

    state_crime_data_a = total_value_data_for_radar[(total_value_data['Totals-Motor']) &
                                                    (total_value_data_for_radar['State'] == response['State'])][
        ['Year', 'Population']].fillna(0)
    state_crime_data_a = state_crime_data_a[["Year", "Population"]]
    state_crime_data_a = state_crime_data_a.rename(columns={'Year': 'axis', 'Population': 'value'})

    state_crime_data_r = total_value_data_for_radar[(total_value_data['Total-Rape']) &
                                                    (total_value_data_for_radar['State'] == response['State'])][
        ['Year', 'Population']].fillna(0)

    state_crime_data_r = state_crime_data_r[["Year", "Population"]]
    state_crime_data_r = state_crime_data_r.rename(columns={'Year': 'axis', 'Population': 'value'})

    state_crime_data_l = total_value_data_for_radar[(total_value_data_for_radar['Total-Robbery']) &
                                                    (total_value_data_for_radar['State'] == response['State'])][
        ['Year', 'Population']].fillna(0)
    state_crime_data_l = state_crime_data_l[["Year", "Population"]]
    state_crime_data_l = state_crime_data_l.rename(columns={'Year': 'axis', 'Population': 'value'})

    state_crime_data_as = total_value_data_for_radar[(total_value_data_for_radar['Total-Assault']) &
                                                     (total_value_data_for_radar['State'] == response['State'])][
        ['Year', 'Population']].fillna(0)
    state_crime_data_as = state_crime_data_as[["Year", "Population"]]
    state_crime_data_as = state_crime_data_as.rename(columns={'Year': 'axis', 'Population': 'value'})

    state_crime_data_p['value'] = state_crime_data_p['value'].astype('int')
    state_crime_data_a['value'] = state_crime_data_a['value'].astype('int')
    state_crime_data_r['value'] = state_crime_data_r['value'].astype('int')
    state_crime_data_l['value'] = state_crime_data_l['value'].astype('int')

    state_crime_data_p['value'] = state_crime_data_p['value'] / state_crime_data_p['value'].sum()
    state_crime_data_a['value'] = state_crime_data_a['value'] / state_crime_data_a['value'].sum()
    state_crime_data_r['value'] = state_crime_data_r['value'] / state_crime_data_r['value'].sum()
    state_crime_data_l['value'] = state_crime_data_l['value'] / state_crime_data_l['value'].sum()

    return {'rape': state_crime_data_r.to_dict('records'), 'motor': state_crime_data_a.to_dict('records'),
            'murder': state_crime_data_p.to_dict('records'), 'larceny': state_crime_data_l.to_dict('records')}


if __name__ == '__main__':
    app.run(debug=True)
