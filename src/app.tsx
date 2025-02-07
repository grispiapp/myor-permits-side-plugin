import { Toaster } from "react-hot-toast";
import { GrispiProvider } from "./contexts/grispi-context";
import { StoreProvider } from "./contexts/store-context";
import { PermitsScreen } from "./screens/permits-screen";

const App = () => {
  return (
    <StoreProvider>
      <GrispiProvider>
        <PermitsScreen />
      </GrispiProvider>
      <Toaster />
    </StoreProvider>
  );
};

export default App;
