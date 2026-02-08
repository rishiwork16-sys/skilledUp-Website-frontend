export function createSignedUrlAppender(masterUrl) {
  let signedParams = null;
  try {
    if (masterUrl) {
      const url = new URL(masterUrl);
      const params = new URLSearchParams(url.search);
      const out = new URLSearchParams();
      for (const key of ['Policy', 'Signature', 'Key-Pair-Id']) {
        const value = params.get(key);
        if (value) out.set(key, value);
      }
      signedParams = out.toString() ? out : null;
    }
  } catch {
    signedParams = null;
  }

  return function appendSignedParams(requestUrl) {
    if (!signedParams || !requestUrl) return requestUrl;
    try {
      const url = new URL(requestUrl, masterUrl || window.location.href);
      for (const [k, v] of signedParams.entries()) {
        if (!url.searchParams.has(k)) {
          url.searchParams.set(k, v);
        }
      }
      return url.toString();
    } catch {
      return requestUrl;
    }
  };
}
