import re
from playwright.sync_api import expect


def login(page, username, password, base_url):
    page.goto(f"{base_url}/login")

    page.get_by_role("textbox", name="Username", exact=True).fill(username)
    page.get_by_role("textbox", name="Password", exact=True).fill(password)

    page.get_by_role(
        "button",
        name="Sign in"
    ).click()

    expect(
        page.get_by_role(
            "button",
            name="Sign out"
        )
    ).to_be_visible(timeout=10000)


def test_comments_are_not_vulnerable_to_xss(page, registered_user, base_url):
    login(
        page,
        registered_user["username"],
        registered_user["password"]
    )

    movie_id = 35
    xss_payload = "<script>window._xss=true</script>"

    page.goto(f"{base_url}/movie/{movie_id}")

    # Adiciona à watchlist
    add_button = page.get_by_role(
        "button",
        name="Add to Watchlist",
        exact=True
    )

    expect(add_button).to_be_enabled(timeout=20000)

    add_button.click()

    expect(
        page.get_by_role(
            "button",
            name="Watched",
            exact=True
        )
    ).to_be_visible(timeout=10000)

  
    page.wait_for_load_state("networkidle")

   
    review_button = page.get_by_role(
        "button",
        name=re.compile(r"Write.*Review", re.IGNORECASE)
    )

    expect(review_button).to_be_visible(timeout=10000)

    review_button.click()

    # Rating
    rating_button = page.get_by_role(
        "button",
        name="6",
        exact=True
    )

    expect(rating_button).to_be_visible(timeout=10000)

    rating_button.click()

   
    textarea = page.locator("textarea")

    expect(textarea).to_be_visible(timeout=10000)

    textarea.fill(xss_payload)

    submit_button = page.get_by_role(
        "button",
        name=re.compile(r"Submit", re.IGNORECASE)
    )

    submit_button.click()

    
    expect(
        page.get_by_text(xss_payload, exact=True)
    ).to_be_visible(timeout=10000)

   
    assert page.evaluate("window._xss === true") is False

    page.reload()

    assert page.evaluate("window._xss === true") is False