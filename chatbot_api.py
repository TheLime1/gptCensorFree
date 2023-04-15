from flask import Flask, render_template, url_for, request, jsonify

app = Flask(__name__)


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

    # initialize POE client with token
    token = "CmpguqkTtuqLZh5w1XeRGw%3D%3D"
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
