import re
import time
from playwright.sync_api import expect


BASE_URL = "https://localhost"

MOVIE_NAME = "Dirty Dancing"

INVALID_USERNAME = "invalid_user"
INVALID_PASSWORD = "wrong_password"

MOVIE_ID = 88


def login(page, username, password):
    page.goto(f"{BASE_URL}/login")

    page.get_by_role("textbox", name="Username", exact=True).fill(username)
    page.get_by_role("textbox", name="Password", exact=True).fill(password)

    page.get_by_role(
        "button",
        name="Sign in"
    ).click()
   


def test_register_page_loads_t01(page):
    page.goto(f"{BASE_URL}/register")

    expect(
        page.locator('div[data-slot="card-title"]')).to_have_text("Create an account")
    

def test_register_new_user_t02(page):
    username = f"test_user_{int(time.time())}"
    email = f"{username}@test.com"

    page.goto(f"{BASE_URL}/register")

    page.get_by_label("Username").fill(username)
    page.get_by_label("Email").fill(email)

   

    page.get_by_role("textbox", name="Password", exact=True).fill("Password123!")

    page.get_by_role(
    "textbox",
    name="Confirm password",
    exact=True ).fill("Password123!")

    page.get_by_role(
        "button",
        name="Create account"
    ).click()

    expect(page).to_have_url(
        re.compile(".*/$")
    )


def test_register_password_mismatch_t03(page):
    page.goto(f"{BASE_URL}/register")

    page.get_by_label("Username").fill("user")
    page.get_by_label("Email").fill("user@test.com")

    page.get_by_role("textbox", name="Password", exact=True).fill("Password123!")

    page.get_by_role(
    "textbox",
    name="Confirm password",
    exact=True ).fill("Password123!wrong")

    page.get_by_role(
        "button",
        name="Create account"
    ).click()

    expect(
        page.locator(".text-destructive")
    ).to_be_visible()


def test_register_link_to_login_t04(page):
    page.goto(f"{BASE_URL}/register")

    page.get_by_role(
        "link",
        name="Sign in"
    ).click()

    expect(page).to_have_url(
        re.compile(".*/login")
    )


def test_invalid_movie_displays_error_t05(page):
    page.goto(
        f"{BASE_URL}/movie/6666666666"
    )

    expect(
        page.get_by_text("Oops!")
    ).to_be_visible(timeout=50_000)


def test_login_page_loads_t06(page):
    page.goto(f"{BASE_URL}/login")

    expect(
        page.locator('div[data-slot="card-title"]')).to_have_text("Welcome back")
    


def test_login_valid_credentials_t07(page, registered_user):
    login(
        page,
        registered_user["username"],
        registered_user["password"]
    )

    expect(page).to_have_url(
        re.compile(".*/$")
    )


def test_login_invalid_password_t08(page, registered_user):
    login(
        page,
        registered_user["username"],
        INVALID_PASSWORD
    )

    expect(
        page.locator(".text-destructive")
    ).to_be_visible()


def test_login_invalid_username_t09(page, registered_user):
    login(
        page,
        INVALID_USERNAME,
        registered_user["password"]
    )

    expect(
        page.locator(".text-destructive")
    ).to_be_visible()


def test_login_invalid_username_invalid_password_t10(page):
    login(
        page,
        INVALID_USERNAME,
        INVALID_PASSWORD
    )

    expect(
        page.locator(".text-destructive")
    ).to_be_visible()




def test_search_page_without_query_t11(page):
    page.goto(f"{BASE_URL}/search")

    expect(
        page.get_by_text(
            "No Search results yet. Start searching for Movies"
        )
    ).to_be_visible()


def test_search_movie_t12(page):
    page.goto(BASE_URL)

    page.get_by_placeholder(
        "Search for a movie…"
    ).fill(MOVIE_NAME)

    page.get_by_role(
        "button",
        name="Search"
    ).click()

    expect(page).to_have_url(
        re.compile(".*search.*")
    )


def test_search_results_are_displayed_t13(page):
    page.goto(
        f"{BASE_URL}/search?title={MOVIE_NAME}"
    )

    expect(
        page.locator("button").first
    ).to_be_visible()


def test_movie_result_can_be_opened_t14(page):
    page.goto(
        f"{BASE_URL}/search?title={MOVIE_NAME}"
    )

    page.get_by_role("button").filter(
        has_text= MOVIE_NAME
    ).first.click()

    expect(page).to_have_url(
        re.compile(".*/movie/.*")
    )



def test_movie_details_page_loads_t15(page):
    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    expect(
        page.get_by_role("heading").first
    ).to_be_visible()


def test_movie_description_displayed_t16(page):
    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    expect(
        page.locator("p").first
    ).to_be_visible()


def test_movie_poster_displayed_t17(page):
    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    expect(
        page.locator("img[alt]").first
    ).to_be_visible()


def test_tmdb_rating_displayed_t18(page):
    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    expect(
        page.get_by_text("TMDB")
    ).to_be_visible()



def test_watchlist_requires_login_t19(page):
    page.goto(
        f"{BASE_URL}/watchlist"
    )

    expect(
        page.get_by_text(
            "You need to be logged in to view your watchlist."
        )
    ).to_be_visible()


def test_add_movie_to_watchlist_t20(authenticated_page):
    page = authenticated_page

    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    add_button = page.get_by_role(
        "button",
        name="Add to Watchlist"
    )

    expect(add_button).to_be_enabled(timeout=20000)

    add_button.click()

    expect(
        page.get_by_role(
            "button",
            name="Watched"
        )
    ).to_be_visible(timeout=10000)


def test_remove_movie_from_watchlist_t21(authenticated_page):
    page = authenticated_page

    page.goto(
        f"{BASE_URL}/movie/{MOVIE_ID}"
    )

    watched_button = page.get_by_role(
        "button",
        name="Watched"
    )

    if watched_button.count() > 0:
        watched_button.click()

    expect(
        page.get_by_role(
            "button",
            name="Add to Watchlist"
        )
    ).to_be_visible()