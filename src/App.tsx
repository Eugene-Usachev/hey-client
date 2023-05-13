import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import {FC} from "react";
import {Page404} from "./pages/page404";
import {LayOut} from "./components/LayOut/LayOut";
import {ReferComponent} from "./components/ReferComponent/ReferComponent";
import {Registration} from "./pages/Registration";
import styles from './components/Alerts/Alerts.module.scss'

const router = createBrowserRouter([
	{
		path: "/",
		element: <ReferComponent />,
		errorElement: <Page404 />,
	},
	{
		path: "/pages/registration",
		element: <Registration />,
		errorElement: <h1>Error! TODO!</h1>, // TODO element, that log an error and reload the page
	},
	{
		path: "/pages/",
		element: <LayOut />,
		children: [
			{
				path: "profile",
				element: <h1>Profile</h1>,
				errorElement: <h1>Error! TODO!</h1>, // TODO element, that log an error and reload the page
			},
			{
				path: "friends",
				element: <h1>Friends</h1>,
				errorElement: <h1>Error! TODO!</h1>, // TODO element, that log an error and reload the page
			},
			{
				path: "messenger",
				element: <h1>Messenger</h1>,
				errorElement: <h1>Error! TODO!</h1>, // TODO element, that log an error and reload the page
			}
		]
	},
]);

export const App: FC = () => {
	return (
		<>
			<RouterProvider router={router} />
			<div className={styles.alertsBlock} id={"alertsBlock"} />
		</>
	)
}
