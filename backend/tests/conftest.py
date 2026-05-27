import pytest
import uuid 
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.session import get_db

TEST_DATABASE_URL = (
    "postgresql://postgres:21092005MINH@localhost:5432/test_db"
)

engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user(client):

    payload = {
        "email": f"test_{uuid.uuid4()}@example.com",
        "full_name": "TEST USER",
        "password": "testuser789@"
    }

    register_response = client.post(
        "/api/v1/auth/register",
        json=payload
    )

    print("Register response: ")
    print(register_response.status_code)
    print(register_response.json())
    print(type(register_response))

    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": payload["email"],
            "password": payload["password"]
        }
    )

    print("Login response: ")
    print(login_response.status_code)
    print(login_response.json())
    print(type(login_response))
    print(type(login_response.json()))

    token = login_response.json()["access_token"]

    return {
        "token": token,
        "user": payload 
    }


@pytest.fixture
def auth_headers(test_user):
    return {
        "Authorization": f"Bearer {test_user['token']}"
    }
