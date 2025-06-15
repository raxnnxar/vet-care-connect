
// Fetch wrapper to avoid conflicts with Lovable development environment
const originalFetch = window.fetch;

export const safeFetch = (...args: Parameters<typeof fetch>): Promise<Response> => {
  // Use the original fetch to bypass any interceptors
  return originalFetch.apply(window, args);
};

// Alternative fetch that clones the request properly
export const cloneSafeFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Create a new request with serializable properties only
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  const safeInit: RequestInit = {
    method: init?.method || 'GET',
    headers: init?.headers ? Object.fromEntries(
      init.headers instanceof Headers 
        ? init.headers.entries()
        : Array.isArray(init.headers)
        ? init.headers
        : Object.entries(init.headers)
    ) : undefined,
    body: init?.body,
    mode: init?.mode,
    credentials: init?.credentials,
    cache: init?.cache,
    redirect: init?.redirect,
    referrer: init?.referrer,
    referrerPolicy: init?.referrerPolicy,
    integrity: init?.integrity,
    keepalive: init?.keepalive,
    signal: init?.signal
  };
  
  return originalFetch(url, safeInit);
};
