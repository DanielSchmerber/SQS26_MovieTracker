from playwright.sync_api import expect

BASE_URL = "https://localhost"




def test_comments_are_not_vulnerable_to_xss(authenticated_xss_page):
    page = authenticated_xss_page

    movie_id = 35
    xss_payload = "<script>window._xss=true</script>"

    # Garantir que a variável não existe antes do teste
    page.goto("about:blank")
    page.evaluate("delete window._xss")

    page.goto(f"{BASE_URL}/movie/{movie_id}")

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



    # Abre formulário de review
    page.get_by_role(
        "button",
        name="Write Review"
    ).click()

    # Seleciona uma nota
    page.get_by_role(
        "button",
        name="6"
    ).click()

    # Insere payload XSS
    page.locator("textarea").fill(xss_payload)

    # Envia review
    page.get_by_role(
        "button",
        name="Submit"
    ).click()

    # Aguarda comentário aparecer
    expect(
        page.get_by_text(xss_payload)
    ).to_be_visible(timeout=10000)

    # Verifica que o script NÃO foi executado
    assert page.evaluate("window._xss === true") is False

    page.reload()

    assert page.evaluate("window._xss === true") is False