import {RegistrationBackground} from "./components/RegistrationBackground/RegistrationBackground";
import {getDictionary} from "@/app/dictionaries";
import {RegistrationBlock} from "@/app/[lang]/registration/components/RegistrationBlock/RegistrationBlock";

export default async function RegistrationPage() {

	const dict = await getDictionary();

	return (
		<div style={{height: '100vh', overflow: 'hidden', overflowY: 'scroll'}}>
			<div style={{
				display: "flex",
				justifyContent: "center",
				zIndex: 2
			}}>
				<RegistrationBlock
					inputDict={dict.UI.Input}
					signUpFormDict={dict.registration.SignUpForm}
					signInFormDict={dict.registration.LoginForm}
					HeaderDict={dict.registration.Header}
				/>
			</div>
			<RegistrationBackground />
		</div>
	);
}