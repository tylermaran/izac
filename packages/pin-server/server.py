import os
import time

from flask import Flask, escape, request, json

PRODUCTION = False # Are we on a production server? @TODO: this is heckin' dum

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    PRODUCTION = True
except RuntimeError:
    print("(>o_o)> pin-server: RPi.GPIO err! Are we on a PI? Do we need sudo?")
    print("(>o_o)> pin-server: Running in non-production mode")


app = Flask(__name__)

@app.route('/pins/<int:pin_id>/fire', methods=["POST"])
def fire_pin(pin_id):
    content = json.loads(request.data)

    if PRODUCTION:
        start_output = GPIO.HIGH if content['output'] else GPIO.LOW
        end_output = GPIO.LOW if content['output'] else GPIO.HIGH

    sleep_ms = int(content['sleep_ms'])

    if PRODUCTION:
        GPIO.setup(pin_id, start_output, initial=start_output)
        GPIO.output(pin_id, start_output)

    time.sleep(sleep_ms / 1000)

    if PRODUCTION:
        GPIO.output(pin_id, end_output)

    return '', 204

if __name__ == '__main__':
      app.run(host='127.0.0.1', port=os.environ.get('PIN_SERVER_PORT'))
