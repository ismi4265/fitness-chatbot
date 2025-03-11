from flask import Flask, request, jsonify
from chatgpt_wrapper import ChatGPT

app = Flask(__name__)
chatbot = ChatGPT()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    response = chatbot.chat(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
