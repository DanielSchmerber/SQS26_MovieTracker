from playwright.sync_api import expect



def test_comments_are_not_vulnerable_to_xss(authenticated_xss_page, base_url):
    page = authenticated_xss_page

    movie_id = 35
    xss_payload = "<script>window._xss=true</script>"

    page.goto("about:blank")
    page.evaluate("delete window._xss")

    page.goto(f"{base_url}/movie/{movie_id}")

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



    page.get_by_role(
        "button",
        name="Write Review"
    ).click()


    page.get_by_role(
        "button",
        name="6"
    ).click()


    page.locator("textarea").fill(xss_payload)


    page.get_by_role(
        "button",
        name="Submit"
    ).click()


    expect(
        page.get_by_text(xss_payload)
    ).to_be_visible(timeout=10000)


    assert page.evaluate("window._xss === true") is False

    page.reload()

    assert page.evaluate("window._xss === true") is False
