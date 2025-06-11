from flask import Flask,request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/search',methods=['POST'])
def search():
    data=request.get_json()
    print(data)
    return data

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)