import re
from playwright.sync_api import expect


MOVIE_NAME = "Dirty Dancing"

INVALID_USERNAME = "invalid_user123"
INVALID_PASSWORD = "wrong_password123"

MOVIE_ID = 88
MOVIE_ID1 = 22



def login(page, username, password,  base_url):
    page.goto(f"{base_url}/login")

    page.get_by_role("textbox", name="Username", exact=True).fill(username)
    page.get_by_role("textbox", name="Password", exact=True).fill(password)
    page.get_by_role("button", name="Sign in").click()


def test_register_page_loads(page,  base_url):
    page.goto(f"{base_url}/register")
    expect(page.locator('div[data-slot="card-title"]')).to_have_text("Create an account")


def test_register_new_user(page, test_user,  base_url):
    username = test_user["username"]
    email = test_user["email"]
    password = test_user["password"]
    page.goto(f"{base_url}/register")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Email").fill(email)
    page.get_by_role("textbox", name="Password", exact=True).fill(password)
    page.get_by_role("textbox",name="Confirm password", exact=True ).fill(password)
    page.get_by_role("button", name="Create account").click()
    expect(page).to_have_url(re.compile(".*/$") )


def test_register_password_mismatch(page, test_user,  base_url):
    username = test_user["username"]
    email = test_user["email"]
    password = test_user["password"]
    page.goto(f"{base_url}/register")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Email").fill(email)
    page.get_by_role("textbox", name="Password", exact=True).fill(password)
    page.get_by_role("textbox", name="Confirm password", exact=True).fill("Password123!wrong")
    page.get_by_role("button", name="Create account").click()
    expect(page.locator(".text-sm.text-destructive")).to_be_visible()


def test_register_link_to_login(page,  base_url):
    page.goto(f"{base_url}/register")
    page.get_by_role("link", name="Sign in").click()
    expect(page).to_have_url(re.compile(".*/login"))

def test_login_page_loads(page,  base_url):
    page.goto(f"{base_url}/login")
    expect(page.locator('div[data-slot="card-title"]')).to_have_text("Welcome back")
    expect(page.get_by_role("button", name="Sign in")).to_be_visible()


def test_login_invalid_password(page, registered_user):
    login(
        page,
        registered_user["username"],
        INVALID_PASSWORD
    )
    expect(page.locator(".text-sm.text-destructive")).to_be_visible(timeout=10000)


def test_login_invalid_username(page, registered_user):
    login(
        page,
        INVALID_USERNAME,
        registered_user["password"]
    )
    expect(page.locator(".text-sm.text-destructive")).to_be_visible(timeout=10000)


def test_login_invalid_username_invalid_password(page):
    login(
        page,
        INVALID_USERNAME,
        INVALID_PASSWORD
    )
    expect(page.locator(".text-sm.text-destructive")).to_be_visible(timeout=10000)

def test_login_valid_credentials(page, registered_user):
    login(
        page,
        registered_user["username"],
        registered_user["password"]
    )

    expect(page).to_have_url(re.compile(".*/$"))
    expect(page.get_by_role("button", name="Sign out")).to_be_visible()

### Non authenticated

def test_search_page_without_query(page,  base_url):
    page.goto(f"{base_url}/search")
    expect(page.get_by_text("No Search results yet. Start searching for Movies")).to_be_visible()



def test_search_movie(page,  base_url):
    page.goto(base_url)

    page.get_by_placeholder("Search for a movie…").fill(MOVIE_NAME)
    page.get_by_role("button", name="Search", exact=True).click()
    expect(page).to_have_url(re.compile(".*search.*"))
    page.goto(f"{base_url}/search?title={MOVIE_NAME}")
    expect(page.locator("button").first).to_be_visible()
    page.get_by_role("button").filter(has_text= MOVIE_NAME).first.click()
    expect(page).to_have_url(re.compile(".*/movie/.*"))


def test_movie_details_page_loads(page,  base_url):
    page.goto(f"{base_url}/movie/{MOVIE_ID}")
    expect(page.get_by_role("heading").first).to_be_visible()
    expect(page.locator("p").first).to_be_visible()
    expect(page.locator("img[alt]").first).to_be_visible()
    expect(page.get_by_text("TMDB")).to_be_visible()


def test_loads_watchlist(page,  base_url):
    page.goto(f"{base_url}/watchlist" )
    expect(page.get_by_text("You need to be logged in to view your watchlist." )).to_be_visible()

## Authenticated

def test_add_watchlist(page,  base_url):
    page.goto(f"{base_url}/watchlist" )
    expect(page.get_by_text("You need to be logged in to view your watchlist." )).to_be_visible()



def test_add_movie_to_watchlist(page, registered_user,  base_url):
    login(
        page, 
        registered_user["username"],
        registered_user["password"]
    )
    expect(page.get_by_role("button", name="Sign out")).to_be_visible(timeout=10000)

    page.goto(f"{base_url}/movie/{MOVIE_ID1}")
    add_button = page.get_by_role("button", name="Add to Watchlist", exact=True)
    expect(add_button).to_be_enabled(timeout=50000)
    add_button.click()
    expect(page.get_by_role("button", name="Watched")).to_be_visible(timeout=10000)

def test_remove_movie_from_watchlist(page, registered_user,  base_url):
    login(
        page, 
        registered_user["username"],
        registered_user["password"]
    )
    expect(page.get_by_role("button", name="Sign out")).to_be_visible(timeout=10000)

    page.goto(f"{base_url}/movie/{MOVIE_ID1}")

    watched_button = page.get_by_role("button", name="Watched",  exact=True)

    expect(watched_button).to_be_visible(timeout=10000)

    watched_button.click()
  
    add_button = page.get_by_role(
    "button",
    name="Add to Watchlist",
    exact=True
    )

    expect(add_button).to_be_visible(timeout=10000)
    expect(add_button).to_be_enabled(timeout=10000)