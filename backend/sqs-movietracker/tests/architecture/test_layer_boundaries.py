from __future__ import annotations

from pathlib import Path

import pytest

from pytestarch import EvaluableArchitecture, Rule, get_evaluable_architecture


def _find_project_root() -> Path:
    cwd = Path.cwd()
    while cwd.name != "sqs-movietracker":
        cwd = cwd.parent
    return cwd


EXCLUSIONS = (
    r".*[/\\]venv[/\\].*",
    r".*[/\\]source[/\\].*",
    r".*[/\\]alembic[/\\].*",
    r".*[/\\]tests[/\\].*",
    r".*__pycache__.*",
)

MODULE = "sqs-movietracker"

SERVICES = f"{MODULE}.services"
MODELS = f"{MODULE}.models"
DEPENDENCIES = f"{MODULE}.dependencies"


@pytest.fixture(scope="session")
def architecture() -> EvaluableArchitecture:
    src_folder = str(_find_project_root())
    return get_evaluable_architecture(
        src_folder,
        src_folder,
        exclusions=(),
        regex_exclusions=EXCLUSIONS,
        exclude_external_libraries=False,
    )


def test_services_do_not_import_fastapi(architecture: EvaluableArchitecture) -> None:
    rule = (
        Rule()
        .modules_that()
        .are_sub_modules_of(SERVICES)
        .should_not()
        .import_modules_that()
        .are_sub_modules_of("fastapi")
    )
    rule.assert_applies(architecture)


def test_models_do_not_import_fastapi(architecture: EvaluableArchitecture) -> None:
    rule = (
        Rule()
        .modules_that()
        .are_sub_modules_of(MODELS)
        .should_not()
        .import_modules_that()
        .are_sub_modules_of("fastapi")
    )
    rule.assert_applies(architecture)


def test_dependencies_do_not_import_models(architecture: EvaluableArchitecture) -> None:
    rule = (
        Rule()
        .modules_that()
        .are_sub_modules_of(DEPENDENCIES)
        .should_not()
        .import_modules_that()
        .are_sub_modules_of("models")
    )
    rule.assert_applies(architecture)
