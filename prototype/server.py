from flask import Flask, render_template, request
from pymongo import MongoClient
import json

app = Flask(__name__)
client = MongoClient()
collection = client['flicker']['sequences']

@app.route('/patterns/')
def patterns():
    return render_template('patterns.html')

@app.route('/editor/')
def editor():
    return render_template('table.html')

@app.route('/save', methods=['POST'])
def save():
    patterns = json.loads(request.form['patterns'])
    print(patterns)
    collection.update({ 'name': patterns['name'] },
        { '$set': patterns }, upsert=True)
    return 'ok'

# @app.route('/showcase')
# def showcase():
#     return

@app.route('/saved/')
@app.route('/saved/<name>')
def saved(name=None):
    if name:
        return single_saved(name)
    else:
        return all_saved()

def single_saved(name):
    data = collection.find_one({'name' : name})
    return json.dumps(data['sequence'])

def _all_saved():
    data = collection.find()
    patterns = []
    for p in data:
        patterns.append({
            'name' : p['name'],
            'sequence': p['sequence']
        })
    return patterns

def all_saved():
    return json.dumps(sorted(_all_saved(), key=lambda e: e['name']))

@app.route('/showcase/')
@app.route('/showcase/<name>')
def showcase(name=None):
    if name:
        return render_template('showcase.html', pair_data=single_saved(name))
    else:
        return render_template('sequences.html', sequences=_all_saved())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5432)
