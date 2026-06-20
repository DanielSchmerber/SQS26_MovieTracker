import os
import time
import pytest
from playwright.sync_api import Page
from playwright.sync_api import expect

BASE_URL = os.getenv("E2E_BASE_URL", "https://localhost")


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "ignore_https_errors": True,
    }


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "ignore_https_errors": True,
    }


@pytest.fixture(scope="session")
def test_user():
    timestamp = int(time.time()) * 11

    return {
        "username": f"test_{timestamp}",
        "email": f"test_{timestamp}@test.com",
        "password": "Password123!test"
    }


@pytest.fixture(scope="session")
def registered_user(browser, test_user):
    context = browser.new_context(
        ignore_https_errors=True
    )

    page = context.new_page()
    page.goto(f"{BASE_URL}/register")

    page.get_by_role("textbox", name="Username", exact=True).fill(test_user["username"])
    page.get_by_role("textbox", name="Email", exact=True).fill(test_user["email"])
    page.get_by_role("textbox", name="Password", exact=True).fill(test_user["password"])
    page.get_by_role("textbox", name="Confirm password", exact=True).fill(test_user["password"])
    page.get_by_role("button", name="Create account" ).click()

    page.close()
    context.close()

    return test_user


@pytest.fixture
def login(page: Page, base_url):
    def perform_login(username, password):
        page.goto(f"{base_url}/login")

        page.get_by_role("textbox", name="Username", exact=True).fill(username)
        page.get_by_role("textbox", name="Password", exact=True).fill(password)
        page.get_by_role("button", name="Sign in").click()

    return perform_login


