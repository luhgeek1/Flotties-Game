import { AppRouter } from "@/app/router";
import { useSyncThemeClass } from "@/app/lib/use-theme";

function App() {
  useSyncThemeClass();

  return <AppRouter />;
}

export default App;
