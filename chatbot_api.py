import poe
import logging
import sys

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/chatbot", methods=["POST"])
def chatbot():
    # get user input from request data
    input_message = request.json.get("input_message")

    # initialize POE client with token
    token = "WqZa9Ic0mCEpffDgYSG-QA%3D%3D"
    client = poe.Client(token)

    # initialize response
    response = ""

    # stream the response from POE client
    for chunk in client.send_message("capybara", input_message, with_chat_break=True):
        response += chunk["text_new"]

    # return response as JSON
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
