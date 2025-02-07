import { Agent, Requester } from "@/grispi/client/tickets/tickets.type";

export interface Settings
  extends Record<
    string,
    string | number | string[] | number[] | boolean[] | boolean | Settings
  > {}

export type GrispiBundle = {
  settings: Settings;
  context: Context;
};

type Context = {
  username: string;
  tenantId: string;
  token: string;
  ticketKey: string;
  agent: Agent;
  requester: Requester;
};

export type JwtToken = {
  aud: string;
  sub: string;
  xid: number;
  fnm: string;
  dev: boolean;
  roles: string[];
  iss: string;
  plg: string;
  exp: number;
  iat: number;
  jti: string;
};
