import requests

GITHUB_TOKEN = "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"

def fetch_commits(repo_url):
    """
    Fetches commit history from the GitHub API for a given repository URL.
    """
    try:
        repo_path = repo_url.replace("https://github.com/", "")
    except Exception:
        raise ValueError("Invalid repository URL")

    api_url = f"https://api.github.com/repos/{repo_path}/commits"

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    response = requests.get(api_url, headers=headers)

    if response.status_code != 200:
        print(f"GitHub API Error: {response.status_code}, {response.text}")  
        raise ValueError(f"GitHub API Error: {response.json().get('message', 'Unknown error')}")

    return response.json()