"use server";

/**
 * Validates if a GitHub repository URL is public and accessible
 * @param {string} repoUrl - The GitHub repository URL
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function validateGitRepo(repoUrl) {
  if (!repoUrl || repoUrl.trim() === "") {
    return { success: true }; // Empty URL is valid (optional field)
  }

  try {
    // Parse GitHub URL to extract owner and repo
    // Supports formats:
    // - https://github.com/owner/repo
    // - https://github.com/owner/repo.git
    // - github.com/owner/repo
    const githubRegex =
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\.]+)/i;
    const match = repoUrl.match(githubRegex);

    if (!match) {
      return {
        success: false,
        error: "Invalid GitHub URL format. Use: https://github.com/owner/repo",
      };
    }

    const [, owner, repo] = match;

    // Check if repo is public using GitHub API (no auth needed for public repos)
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "DevSandbox-App",
      },
    });

    if (response.status === 404) {
      return {
        success: false,
        error:
          "Repository not found or is private. Only public repositories are supported.",
      };
    }

    if (response.status === 403) {
      return {
        success: false,
        error: "GitHub API rate limit exceeded. Please try again later.",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to validate repository: ${response.statusText}`,
      };
    }

    const repoData = await response.json();

    // Double-check that the repo is public
    if (repoData.private) {
      return {
        success: false,
        error:
          "This repository is private. Only public repositories are supported.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error validating GitHub repo:", error);
    return {
      success: false,
      error:
        "Failed to validate repository. Please check the URL and try again.",
    };
  }
}
