import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { grispiAPI } from "@/grispi/client/api";
import { Ticket } from "@/grispi/client/tickets/tickets.type";
import { parseJwt } from "@/lib/utils";
import { GrispiBundle } from "@/types/grispi.type";

type GrispiContextType = {
  ticket: Ticket | null;
  bundle: GrispiBundle | null;
  loading: boolean;
};

if (!window.Grispi) {
  throw new Error("Grispi SDK not found.");
}

const plugin = window.Grispi.instance();

const GrispiContext = createContext<GrispiContextType | null>(null);

export const GrispiProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bundle, setBundle] = useState<GrispiBundle | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    plugin.init().then(async (bundle: GrispiBundle) => {
      setBundle(bundle);

      if (!bundle.context.ticketKey) {
        setLoading(false);
        return;
      }

      if (parseJwt(bundle.context.token)?.dev === true) {
        grispiAPI.http().setBaseUrl("https://api.grispi.net");
      }

      grispiAPI.authentication.setTenantId(bundle.context.tenantId);
      grispiAPI.authentication.setToken(bundle.context.token);

      const ticket = await grispiAPI.tickets.getTicket(
        bundle.context.ticketKey
      );

      setTicket(ticket);
      setLoading(false);
    });

    plugin.currentTicketUpdated = async (ticketKey: string) => {
      setLoading(true);

      try {
        const ticket = await grispiAPI.tickets.getTicket(ticketKey);
        setTicket(ticket);
      } catch (err) {
        console.error(
          "grispi-context",
          "currentTicketUpdated",
          "Error when fetching ticket details",
          ticketKey
        );
      }

      setLoading(false);
    };
  }, []);

  return (
    <GrispiContext.Provider
      value={{
        ticket,
        bundle,
        loading,
      }}
    >
      {children}
    </GrispiContext.Provider>
  );
};

export const useGrispi = () => {
  const grispi = useContext(GrispiContext);

  if (!grispi) {
    throw new Error("useGrispi must be used within a GrispiProvider.");
  }

  return grispi;
};
