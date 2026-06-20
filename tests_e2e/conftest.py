import time
import pytest
import os


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
def test_user():
    timestamp = int(time.time())

    return {
        "username": f"test_{timestamp}",
        "email": f"test_{timestamp}@test.com",
        "password": "Password123!"
    }



@pytest.fixture(scope="session")
def registered_user(browser, base_url, test_user):
    context = browser.new_context(
        ignore_https_errors=True
    )

    page = context.new_page()

    page.goto(f"{base_url}/register")

    page.get_by_role("textbox", name="Username", exact=True).fill(test_user["username"])
    page.get_by_role("textbox", name="Email", exact=True).fill(test_user["email"])
    page.get_by_role("textbox", name="Password", exact=True).fill(test_user["password"])
    page.get_by_role("textbox", name="Confirm password", exact=True).fill(test_user["password"])

    page.get_by_role(
        "button",
        name="Create account"
    ).click()

    page.close()
    context.close()

    return test_user


@pytest.fixture()
def authenticated_page(browser, base_url, registered_user):
    context = browser.new_context(
        ignore_https_errors=True
    )

    page = context.new_page()

    page.goto(f"{base_url}/login")

    page.get_by_role("textbox", name="Username", exact=True).fill(registered_user["username"])
   
    page.get_by_role("textbox", name="Password", exact=True).fill(registered_user["password"])
    

    page.get_by_role(
        "button",
        name="Sign in"
    ).click()

    return page


@pytest.fixture()
def authenticated_xss_page(browser, base_url):
    timestamp = int(time.time() * 1000)

    username = f"xss_{timestamp}"
    password = "Password123!"

    context = browser.new_context(
        ignore_https_errors=True
    )

    page = context.new_page()

    # register
    page.goto(f"{base_url}/register")

    page.get_by_role("textbox", name="Username", exact=True).fill(username)
    page.get_by_role("textbox", name="Email", exact=True).fill(f"{username}@test.com")
    page.get_by_role("textbox", name="Password", exact=True).fill(password)
    page.get_by_role("textbox", name="Confirm password", exact=True).fill(password)

    page.get_by_role(
        "button",
        name="Create account"
    ).click()

    yield page

    context.close()
