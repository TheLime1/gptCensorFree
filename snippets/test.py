import poe
import logging
import sys

# send a message and stream the response

token = ""  # cookie token
client = poe.Client(token)

message = input("type your message here\n")
for chunk in client.send_message("capybara", message, with_chat_break=True):
    print(chunk["text_new"], end="", flush=True)
