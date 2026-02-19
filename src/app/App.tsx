import { AppRouter } from "@/app/router";
import { useSyncThemeClass } from "@/shared/lib/use-theme";

function App() {
  useSyncThemeClass();

  return <AppRouter />;
}

export default App;
