def test_create_analysis(
    client,
    auth_headers
):
    # Create project first
    project_response = client.post(
        "/api/v1/projects",
        json={
            "name": "Analysis Project",
            "description": "Testing"
        },
        headers=auth_headers
    )

    project = project_response.json()

    # Create document
    document_response = client.post(
        f"/api/v1/projects/{project['id']}/documents",
        json={
            "title": "Attention Is All You Need",
            "source_type": "pdf"
        },
        headers=auth_headers
    )

    document = document_response.json()

    # Create analysis
    response = client.post(
        f"/api/v1/projects/{project['id']}/analyze",
        params={
            "document_id": document["id"]
        },
        headers=auth_headers
    )

    assert response.status_code == 201

    data = response.json()

    assert data["document_id"] == document["id"]
    assert data["status"] == "pending"


def test_get_analysis_results(
    client,
    auth_headers
):
    project_response = client.post(
        "/api/v1/projects",
        json={
            "name": "Analysis Results Project"
        },
        headers=auth_headers
    )

    project = project_response.json()

    document_response = client.post(
        f"/api/v1/projects/{project['id']}/documents",
        json={
            "title": "GPT Paper",
            "source_type": "pdf"
        },
        headers=auth_headers
    )

    document = document_response.json()

    analysis_response = client.post(
        f"/api/v1/projects/{project['id']}/analyze",
        params={
            "document_id": document["id"]
        },
        headers=auth_headers
    )

    analysis = analysis_response.json()

    response = client.get(
        f"/api/v1/analysis/{analysis['id']}/results",
        headers=auth_headers
    )

    assert response.status_code == 200
