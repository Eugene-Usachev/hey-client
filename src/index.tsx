import {initConfig} from "./config";
import ReactDOM from 'react-dom/client';
import {App} from "./App";
import {initTheme} from "./utils/initTheme";
import {CommonAlert} from "./components/Alerts/Alerts";

initConfig();
initTheme();

const start = () => {
	ReactDOM.createRoot( (document.getElementById ("root") as HTMLElement) ).render(
		<App />
	)
}

start();