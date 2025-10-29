from selenium import webdriver
from selenium.webdriver.common.by import By
# imported os just to clear cmd via cls
import os

try: 
        # Browser type
    driver = webdriver.Safari()

    # URL
    driver.get("https://duckduckgo.com/")

    # Finders
    text_box = driver.find_element(by=By.ID, value="searchbox_input")
    submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button[aria-label='Search']")

    # Assign values
    text_box.send_keys("Hello world!")
    # Assign actions
    submit_button.click()

    result_text = driver.find_element(by=By.CSS_SELECTOR, value="span._97w2Z3njlMm7Og_zyqu4")
    os.system("cls")
    print(result_text.text)

    # Quit
    # driver.quit()
    # hang it till you close the input
    input("Press enter to close...")
except Exception as error:
    print("Error: ",error)