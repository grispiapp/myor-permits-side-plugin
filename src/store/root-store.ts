import { CurrentUserStore } from "./current-user-store";

export class RootStore {
  currentUser: CurrentUserStore;

  constructor() {
    this.currentUser = new CurrentUserStore(this);
  }
}
