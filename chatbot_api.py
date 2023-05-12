from flask import Flask, render_template, url_for, request, jsonify
from flask_cors import CORS  # import CORS module

app = Flask(__name__)
CORS(app)  # enable CORS

sage = "capybara"
gpt = "chinchilla"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/static/style.css")
def style():
    return app.send_static_file("style.css")


@app.route("/static/script.js")
def script():
    return app.send_static_file("script.js")


@app.route("/chatbot", methods=["POST"])
def chatbot():
    import poe
    # get user input from request data
    input_message = request.json.get("input_message")

    # print the sent message in the terminal for debugging
    print("\nSent message: ", input_message)

    # initialize POE client with token
    with open('token.txt', 'r') as f:  # put your token in token.txt
        token = f.read().rstrip()
    client = poe.Client(token)

    # initialize response
    response = ""

    # stream the response from POE client
    for chunk in client.send_message(sage, input_message, with_chat_break=True):
        response += chunk["text_new"]

    # print the received response in the terminal for debugging
    print("Received response: ", response, "\n")

    # return response as JSON
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
