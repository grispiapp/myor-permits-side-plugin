import { Authentication } from "./authentication";
import { HttpHandler } from "./http-handler";
import { Tickets } from "./tickets/tickets";

export class GrispiAPI {
  private httpHandler: HttpHandler;
  readonly authentication: Authentication;
  readonly tickets: Tickets;

  constructor() {
    this.httpHandler = new HttpHandler();
    this.authentication = new Authentication(this.httpHandler);
    this.tickets = new Tickets(this.httpHandler, this.authentication);
  }

  http() {
    return this.httpHandler;
  }
}

export const grispiAPI = new GrispiAPI();
