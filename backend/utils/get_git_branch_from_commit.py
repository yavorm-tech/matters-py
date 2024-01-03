# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest
import time
import re
import sys
from getpass import getpass
import pdb,tracemalloc
tracemalloc.start()
github_account = ""
github_passwd = ""#getpass("input your github password:")
git_url = "https://github.com/dinogreenrex/reactifus/commit/2b2aa85a23fd5169b7a3f8837cbdfc4b4e19053b"
def get_git_branch(giturl, github_account, github_passwd):

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(30)
    base_url = "https://github.com/"
    verificationErrors = []
    accept_next_alert = True
    driver.get(base_url + "/login")
    driver.find_element(By.ID,"login_field").clear()
    driver.find_element(By.ID,"login_field").send_keys(github_account)
    driver.find_element(By.ID,"password").clear()
    driver.find_element(By.ID,"password").send_keys(github_passwd)
    driver.find_element(By.NAME,"commit").click()
    driver.get(giturl)
    elem = driver.find_element(By.CLASS_NAME,"branch");
    return elem.text
#        snapshot = tracemalloc.take_snapshot()
#        top_stats = snapshot.statistics('lineno')

#        print("[ Top 10 ]")
#        for stat in top_stats[:10]:
#            print(stat)


