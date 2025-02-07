import { RootStore } from "./root-store";
import { makeAutoObservable } from "mobx";

type UserCredentials = {
  grispi_access_token: string;
};

export class CurrentUserStore {
  rootStore: RootStore;
  credentials?: UserCredentials;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  updateCredentials(credentials: UserCredentials) {
    this.credentials = credentials;
  }
}
