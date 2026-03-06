from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/api/industries', methods=('GET',))
def get_industries():
    conn = sqlite3.connect('industry.db')
    conn.row_factory = sqlite3.Row
    rows = conn.execute('SELECT * FROM industries').fetchall()
    
    result_list = list()
    for row in rows:
        result_list.append(dict(row))
        
    conn.close()
    return jsonify(result_list)

if __name__ == '__main__':
    app.run(port=5000)