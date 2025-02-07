import { Authentication } from "../authentication";
import { HttpHandler } from "../http-handler";
import { Ticket, UpdateTicketPayload } from "./tickets.type";

export class Tickets {
  constructor(
    private http: HttpHandler,
    private auth: Authentication
  ) {}

  async getTicket(ticketKey: string) {
    const response = await this.http.send<Ticket>(
      `public/v1/tickets/${ticketKey}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: this.auth.headers,
      }
    );

    return response;
  }

  async updateTicket(ticketKey: string, data: UpdateTicketPayload) {
    const response = await this.http.send<Ticket>(
      `public/v1/tickets/${ticketKey}`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers: this.auth.headers,
        body: JSON.stringify(data),
      }
    );

    return response;
  }
}
