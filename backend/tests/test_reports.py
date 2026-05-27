def create_project(client, headers):

    response = client.post(
        "/api/v1/projects",
        json={
            "name": "Reports Project",
            "description": "Testing reports"
        },
        headers=headers
    )

    return response.json()


def test_create_report(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    payload = {
        "title": "LLM Research Report",
        "report_type": "research_summary"
    }

    response = client.post(
        f"/api/v1/projects/{project['id']}/reports",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == payload["title"]


def test_get_project_reports(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    client.post(
        f"/api/v1/projects/{project['id']}/reports",
        json={
            "title": "First Report",
            "report_type": "research_summary"
        },
        headers=auth_headers
    )

    response = client.get(
        f"/api/v1/projects/{project['id']}/reports",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert "reports" in data


def test_update_report(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    create_response = client.post(
        f"/api/v1/projects/{project['id']}/reports",
        json={
            "title": "Old Report",
            "report_type": "research_summary"
        },
        headers=auth_headers
    )

    report = create_response.json()

    update_response = client.put(
        f"/api/v1/reports/{report['id']}",
        json={
            "title": "Updated Report"
        },
        headers=auth_headers
    )

    assert update_response.status_code == 200

    updated = update_response.json()

    assert updated["title"] == "Updated Report"


def test_delete_report(
    client,
    auth_headers
):
    project = create_project(
        client,
        auth_headers
    )

    create_response = client.post(
        f"/api/v1/projects/{project['id']}/reports",
        json={
            "title": "Delete Report",
            "report_type": "research_summary"
        },
        headers=auth_headers
    )

    report = create_response.json()

    delete_response = client.delete(
        f"/api/v1/reports/{report['id']}",
        headers=auth_headers
    )

    assert delete_response.status_code == 204
