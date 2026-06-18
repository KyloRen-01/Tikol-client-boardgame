import { registerRootComponent } from "expo";
import { installGlobalDiagnostics } from "./src/diagnostics/installGlobalDiagnostics";
import App from "./src/App";

installGlobalDiagnostics();
registerRootComponent(App);
