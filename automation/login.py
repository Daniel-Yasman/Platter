from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os

try: 
    # PROFILE_DIR = the chrome profile I'll save, important, because I'll be using localStorage and if I do not
    # have this set I'll start a new fresh session each time, makes it useless for things like ordering or logging off.
    PROFILE_DIR = "/Users/daniel/Documents/Full-Stack Project (School Project)/automation/Chrome Profile"

    # os.makedirs creates the folder path in PROFILE_DIR if it doesn’t already exist.
    os.makedirs(PROFILE_DIR, exist_ok=True)

    # ChromeOptions() in this instance just enables profile persistence and saves it in PROFILE_DIR.
    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={PROFILE_DIR}")
    options.add_argument("--profile-directory=Default")

    driver = webdriver.Chrome(options=options)

    # Maximise window
    try:
        driver.maximize_window()
    except:
        pass

    # URL
    driver.get("http://localhost:5173/")
    
    # Click sign up
    sign_up_button = driver.find_element(by=By.XPATH, value='//a[text()="Sign up"]')
    sign_up_button.click()
    
    # Fill form
    email = driver.find_element(by=By.XPATH, value="//*[@id='email']")
    email.send_keys("admin")
    password = driver.find_element(by=By.XPATH, value="//*[@id='password']")
    password.send_keys("9959")
    
    # Submit
    submit = driver.find_element(by=By.XPATH, value='//button[text()="Log In"]')
    submit.click()

    # Wait untill you get the item from localStorage
    # This is explicit waiting, meaning the code below waits up to X seconds for localStorage items to load and use.
    for _ in range(10): # 10 as in, 10 seconds
        userId = driver.execute_script("return window.localStorage.getItem('userId');")
        if userId:
            break
        # time.sleep(x) is a safety measure to make sure userId's variable loads successfully.
        time.sleep(1)
    
    print(f"localStorage userId: {userId}")

    # Quit
    # driver.quit()

    # hang it till you close the input
    input("Press Enter to close...")
except Exception as error:
    print("Error: ", error)