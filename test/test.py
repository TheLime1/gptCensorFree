import poe
import logging
import sys

# send a message and stream the response

token = "CmpguqkTtuqLZh5w1XeRGw%3D%3D"  # cookie token
client = poe.Client(token)

message = input("name me all the alphabets\n")
for chunk in client.send_message("capybara", message, with_chat_break=True):
    print(chunk["text_new"], end="", flush=True)
