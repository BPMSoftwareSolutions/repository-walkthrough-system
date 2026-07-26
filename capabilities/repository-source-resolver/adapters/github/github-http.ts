export interface GithubHttpObservation {
  status: "observed" | "not-found" | "access-denied" | "unreachable";
  providerStatus: number | null;
  body?: any;
}

export async function observesGithubJson(
  path: string,
  fetchImplementation: typeof fetch
): Promise<GithubHttpObservation> {
  try {
    const response = await fetchImplementation(`https://api.github.com${path}`, {
      method: "GET",
      headers: {
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "repository-walkthrough-system"
      }
    });
    if (response.status === 404) return { status: "not-found", providerStatus: 404 };
    if (response.status === 401 || response.status === 403) {
      return { status: "access-denied", providerStatus: response.status };
    }
    if (!response.ok) return { status: "unreachable", providerStatus: response.status };
    return {
      status: "observed",
      providerStatus: response.status,
      body: await response.json()
    };
  } catch {
    return { status: "unreachable", providerStatus: null };
  }
}
