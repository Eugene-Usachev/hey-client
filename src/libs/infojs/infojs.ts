import {Eye} from "./eye";
import {handEye} from "../hand/hand";

export const eye = new Eye();
handEye.eye = eye;
/** working only with Eye library.
 * @param willShow is u want to show that initConfig() will be called
 */
export const init = (willShow: boolean) => {
	if (willShow) {
		eye.info('initConfig infojs!');
	}
}