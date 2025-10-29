from selenium import webdriver
from selenium.webdriver.common.by import By
import os
# Anything rusty go to login.py for refreshers.
try: 
    PROFILE_DIR = "/Users/daniel/Documents/Full-Stack Project (School Project)/automation/Chrome Profile"
    os.makedirs(PROFILE_DIR, exist_ok=True)

    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={PROFILE_DIR}")
    options.add_argument("--profile-directory=Default")

    driver = webdriver.Chrome(options=options)

    try:
        driver.maximize_window()
    except:
        pass

    driver.get("http://localhost:5173/")
    
    profile_button = driver.find_element(by=By.XPATH, value='//a[@href="/my-reservations"]')
    profile_button.click()

    logout_button = driver.find_element(by=By.XPATH, value='//button[text()="Logout"]')
    logout_button.click()

    input("Press Enter to close...")
except Exception as error:
    print("Error: ", error)