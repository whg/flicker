from flask import Flask, render_template, request
from pymongo import MongoClient
import json

app = Flask(__name__)
client = MongoClient()
collection = client['flicker']['sequences']

@app.route('/patterns')
def patterns():
    return render_template('patterns.html')

@app.route('/editor')
def editor():
    return render_template('table.html')

@app.route('/save', methods=['POST'])
def save():
    patterns = json.loads(request.form['patterns'])
    collection.insert(patterns)
    return 'ok'

@app.route('/saved')
def saved():
    data = collection.find()
    patterns = []
    for p in data:
        patterns.append({
            'name' : p['name'],
            'sequence': p['sequence']
        })
    return json.dumps(sorted(patterns, key=lambda e: e['name']))

if __name__ == "__main__":
    app.run()
