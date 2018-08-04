from time import sleep

import urllib.request
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec

from tests import IonicSeleniumTestCase


class BankPageTestCase(IonicSeleniumTestCase):
    def setUp(self):
        """
        Setting up BankPageTestCase.
        """
        self.driver.get(self.address)
        navbar_selector = "ion-header > ion-navbar > button.bar-buttons"
        self.wait.until(
            ec.presence_of_element_located((By.CSS_SELECTOR, navbar_selector))
        )

    def test_loading_appearance(self):
        """
        Testing loading modal.
        """
        for i in range(2):
            self.go_to_page("#merkez-bank-page")
            sleep(0.1)

            try:
                elm = self.driver.find_element_by_css_selector(".loading-wrapper")
            except Exception as e:
                self.fail(str(e))

            self.setUp()

    def test_currencies_appearance(self):
        with urllib.request.urlopen("http://185.64.80.30/kur/gunluk.xml") as response:
            content: bytes = response.read()
            count = content.count(b"<Resmi_Kur>")

        self.go_to_page("#merkez-bank-page")
        self.wait.until(
            ec.presence_of_element_located((By.TAG_NAME, "ion-card"))
        )

        elms = self.driver.find_elements_by_tag_name("ion-card")
        self.assertEqual(len(elms), count)

    def test_currencies_content(self):
        with urllib.request.urlopen("http://185.64.80.30/kur/gunluk.xml") as response:
            xml = BeautifulSoup(response.read(), "lxml")

        xml_elms = xml.find_all("resmi_kur")

        self.go_to_page("#merkez-bank-page")
        self.wait.until(
            ec.presence_of_element_located((By.TAG_NAME, "ion-card"))
        )

        dom_elms = self.driver.find_elements_by_tag_name("ion-card")

        for index, de in enumerate(dom_elms):
            xe = xml_elms[index]

            # parse dom content
            de_header = de.find_element_by_tag_name("ion-card-header")
            de_list_items = de.find_elements_by_tag_name("ion-item")

            # parse xml content
            header_text = de_header.text
            value = xe.find("birim", recursive=False)
            symbol = xe.find("sembol", recursive=False)
            name = xe.find("isim", recursive=False)

            # validate xml content
            self.assertIn(value.string+" ", header_text)
            self.assertIn(symbol.string, header_text)
            self.assertIn(name.string, header_text)
