def create_project(client, headers):

    payload = {
        "name": "AI Research Project",
        "description": "Testing project"
    }

    response = client.post(
        "/api/v1/projects",
        json=payload,
        headers=headers
    )

    return response.json()


def test_create_research_session(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    payload = {
        "query": "Large Language Models",
        "max_results": 10
    }

    response = client.post(
        f"/api/v1/projects/{project['id']}/research",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 201

    data = response.json()

    assert data["query"] == payload["query"]
    assert data["status"] == "pending"


def test_get_research_status(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    response = client.post(
        f"/api/v1/projects/{project['id']}/research",
        json={
            "query": "Transformer Architecture",
            "max_results": 5
        },
        headers=auth_headers
    )

    research = response.json()

    status_response = client.get(
        f"/api/v1/projects/{project['id']}/research/{research['id']}",
        headers=auth_headers
    )

    assert status_response.status_code == 200

    data = status_response.json()

    assert data["id"] == research["id"]


def test_get_research_results(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    response = client.post(
        f"/api/v1/projects/{project['id']}/research",
        json={
            "query": "RAG systems",
            "max_results": 5
        },
        headers=auth_headers
    )

    research = response.json()

    results_response = client.get(
        f"/api/v1/research/{research['id']}/results",
        headers=auth_headers
    )

    assert results_response.status_code == 200
