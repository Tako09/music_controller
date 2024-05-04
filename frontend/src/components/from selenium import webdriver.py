from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import pandas as pd
import os
import shutil
from google.cloud import bigquery

def main():

    # declare variables
    id = r"ec2@tie-s.jp"
    psw = r"qiTbR4zw"
    login_url = r"https://pub.monkey-ads.com/#/login"
    tag_url = r"https://pub.monkey-ads.com/#/reports/tag"
    current_path = os.getcwd()
    download_folder = f"{current_path}/monkey2bq/tmp/"

    # setting webdriver object
    options = webdriver.ChromeOptions()
    # options.add_experimental_option("prefs", {"download.default_directory": download_folder}) # set default download folder
    options.page_load_strategy = "eager"
    options.add_argument('--headless')
    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(15) # seconds

    # login
    browser.get(login_url)
    browser.find_element(By.XPATH, '//*[@id="login"]/section/div/div/div[1]/div/div/div[1]/div[1]/div/input').send_keys(id) # id 
    browser.find_element(By.XPATH, '//*[@id="login"]/section/div/div/div[1]/div/div/div[1]/div[2]/div/input').send_keys(psw) # paswaord
    time.sleep(1)
    browser.find_element(By.XPATH, '//*[@id="login"]/section/div/div/div[1]/div/div/div[3]/div/p/button').click() # login button
    time.sleep(1)

    # download csv
    # if not os.path.exists(download_folder):
    #     os.mkdir(download_folder) # create tmp folder

    browser.get(tag_url)
    time.sleep(1)
    browser.find_element(By.XPATH, '//*[@id="report"]/div[3]/div/div[2]/button').click() # download csv button
    browser.close()

    # to dataframe
    # file_name = os.listdir(download_folder)[0]
    # df = pd.read_csv(f"{download_folder}{file_name}", dtype="str")
    # print(df)
    # shutil.rmtree(download_folder) # delete tmp folder

    # to BQ

def toBq():
    project_id = "ties-dataplatform"
    client = bigquery.Client(project=project_id)
    table = client.get_table()

if __name__ == "__main__":
    main()
    