import React, {memo, FC} from 'react';
import {Error404} from "../components/Error404/Error404";

export const Page404: FC = memo(() => {

	return (
		<div style={{display: 'grid', position: 'relative', top: '0', left: '0', width: '100vw', height: '100vh'}}>
			<Error404/>
		</div>
	);
});