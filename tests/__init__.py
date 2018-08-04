from time import sleep

import subprocess
import unittest
from selenium import webdriver
from selenium.webdriver.firefox import options as opts
from selenium.webdriver.support.wait import WebDriverWait


class IonicSeleniumTestCase(unittest.TestCase):
    ionic_subprocess: subprocess.Popen = None
    driver: webdriver.Firefox = None

    @classmethod
    def setUpClass(cls):
        """
        Setting up IonicSeleniumTestCase class.
        """
        cls.ionic_subprocess = subprocess.Popen(
            [
                "ionic", "serve",
                "--address", "127.0.0.1",
                "--port", "8989",
                "--no-open"
            ],
            stdout=subprocess.PIPE
        )

        for c in iter(cls.ionic_subprocess.stdout.readline, b""):
            if c is None:
                continue

            if b"Development server running" in c:
                break

        options = opts.Options()
        options.add_argument("--headless")
        cls.driver = webdriver.Firefox(options=options)
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.address = "http://127.0.0.1:8989"

    def go_to_page(self, selector: str):
        navbar_selector = "ion-header > ion-navbar > button.bar-buttons"
        navbar = self.driver.find_element_by_css_selector(navbar_selector)
        navbar.click()
        sleep(0.5)
        elm = self.driver.find_element_by_css_selector(selector)
        elm.click()

    @classmethod
    def tearDownClass(cls):
        """
        Tearing down IonicSeleniumTestCase class.
        """
        cls.ionic_subprocess.kill()
        cls.driver.quit()
