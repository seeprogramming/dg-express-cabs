import { siteConfig } from "@/config/site";

/**
 * Returns an absolute canonical URL for a given site path.
 * Strips query parameters, hashes, trailing slashes (except root '/'),
 * and ensures the canonical domain (https://dgexpresscabs.com).
 *
 * @param path Relative path, e.g. "/cabs", "/cabs/pune-to-mumbai", or "/"
 */
export function getCanonicalUrl(path: string = "/"): string {
  if (!path || path === "/" || path === "") {
    return siteConfig.url;
  }

  // Strip query string and hash
  const cleanPath = path.split("?")[0].split("#")[0];
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  // Strip trailing slash if not root
  const trimmedPath =
    normalizedPath.length > 1 && normalizedPath.endsWith("/")
      ? normalizedPath.slice(0, -1)
      : normalizedPath;

  return `${siteConfig.url}${trimmedPath}`;
}
