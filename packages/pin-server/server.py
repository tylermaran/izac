from flask import Flask, escape, request
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

app = Flask(__name__)

@app.route('/pins/<int:pin_id>/fire', methods=["POST"])
def fire_pin(pin_id):
    content = request.json

    start_output = GPIO.HIGH if content['output'] else GPIO.LOW
    end_output = GPIO.LOW if content['output'] else GPIO.HIGH
    sleep_ms = int(content['sleep_ms'])

    GPIO.setup(pin_id, start_output, initial=start_output)
    GPIO.output(pin_id, start_output)

    time.sleep(sleep_ms / 1000)

    GPIO.output(pin_id, end_output)

    return '', 204
