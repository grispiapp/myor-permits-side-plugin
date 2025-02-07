import { HttpHandler } from "./http-handler";

export class Authentication {
  public headers: Record<string, string> = {};

  constructor(private http: HttpHandler) {}

  setTenantId(tenantId: string) {
    this.headers["tenantId"] = tenantId;
  }

  setToken(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  setHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
  }
}
