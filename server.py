from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import *

app = Flask(__name__)
CORS(app)


@app.route('/heartbeat', methods=['POST'])
def heartbeat():
  check_activity(active_peers)

  data = request.get_json()
  active_peers[data['id']] = {'time':time.time(), 'username':data['username'], 'opponent': data['opponent']}  # Update last active timestamp
  return jsonify({"message": "Heartbeat received", "active_peers": active_peers})

@app.route('/heartbeat_chess', methods=['POST'])
def heartbeat_chess():
  check_activity(active_peers_chess)

  data = request.get_json()
  active_peers_chess[data['id']] = {'time':time.time(), 'username':data['username'], 'opponent': data['opponent']}  # Update last active timestamp
  return jsonify({"message": "Heartbeat received", "active_peers": active_peers_chess})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
