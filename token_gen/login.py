import poe
import time

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

# Get user's email
email = input("Enter your email: ")

options = webdriver.ChromeOptions()
# options.add_argument("--headless") #bring it back when done testing
options.add_experimental_option('excludeSwitches', ['enable-logging'])

driver = webdriver.Chrome(options=options)

driver.get("https://poe.com/login")
assert "Poe" in driver.title

time.sleep(5)

# Click "Use email" button
buttons = driver.find_elements_by_class_name("Button_buttonBase__0QP_m")
# Assuming the email button is the second button with this class name
email_button = buttons[1]
email_button.click()

# Enter user's email and wait for verification code
print(f"Please check your email '{email}' for verification code.")
time.sleep(5)
email_input = driver.find_element(
    By.CLASS_NAME, "EmailInput_emailInput__4v_bn")
email_input.send_keys(email)
email_input.send_keys(Keys.RETURN)

while True:
    code = input("Enter the verification code: ")
    if len(code) == 6 and code.isdigit():
        break
    print("Invalid verification code. Please enter a 6-digit number.")

# Enter the verification code
code_input = driver.find_element(
    By.CLASS_NAME, "VerificationCodeInput_verificationCodeInput__YD3KV")
code_input.send_keys(code)
code_input.send_keys(Keys.RETURN)

# Get token and save to a file
token = driver.get_cookie("p-b")["value"]
with open("token.txt", "w") as f:
    f.write(token)

client = poe.Client(token)
print("Login successful. Bots available: ", client.get_bot_names())

driver.close()
