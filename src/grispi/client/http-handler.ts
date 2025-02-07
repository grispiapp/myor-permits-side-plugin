export class HttpHandler {
  baseUrl: string = "https://api.grispi.com";
  headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async send<T>(url: string, options: RequestInit): Promise<T | null> {
    const response = await fetch(`${this.baseUrl}/${url}`, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error("Http Error");
  }
}
