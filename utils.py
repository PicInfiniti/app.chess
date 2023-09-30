from flask import Flask, request, jsonify
import time

active_peers = {}
def check_activity():
    current_time = time.time()
    inactive_peers = []
    for id, item in active_peers.items():
      if current_time - item['time'] > 7:
        inactive_peers.append(id)
  
    # Remove inactive peers from the active_peers dictionary
    for id in inactive_peers:
      del active_peers[id]
      
    return jsonify({"inactive_peers": inactive_peers, "active_peers": active_peers})

def get_origin(request):
  if 'Origin' in request.headers:
    origin = request.headers['Origin']
    print (f'Request Origin: {origin}')
  else:
    print ('Origin header not found in the request')