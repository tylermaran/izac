import os
from waitress import serve
from server import app

serve(app, host='0.0.0.0', port=os.environ.get('PIN_SERVER_PORT'))
