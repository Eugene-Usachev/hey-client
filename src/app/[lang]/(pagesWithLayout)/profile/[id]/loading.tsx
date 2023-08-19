import React, {} from 'react';
import {
	LoadingRightColumn
} from "@/app/[lang]/(pagesWithLayout)/profile/components/LoadingRightColumn/LoadingRightColumn";

export default function Loading() {

	return (
		<div style={{"height": "100%", display: 'flex'}}>
			{/*left column*/}
			<div style={{width: '180px', display: 'flex', flexFlow: 'column', alignItems: 'center', margin: '5px 15px'}}>
				<div style={{display: 'flex', flexFlow: 'column', width: '170px', alignItems: 'center', marginTop: '10px', borderRadius: '20px', border: '1px solid var(--colors-hover)', padding: '10px 5px'}}>
					<div style={{height: '130px', width: '130px', borderRadius: '50%', marginBottom: '10px'}} className={"skeleton"}></div>
					<div style={{display: 'flex', flexFlow: 'column', width: '100%', alignItems: 'center'}}>
						<div className={"skeleton"} style={{width: '150px', height: '25px', borderRadius: '8px', marginBottom: '10px'}}></div>
						<div className={"skeleton"} style={{width: '150px', height: '25px', borderRadius: '8px'}}></div>
					</div>
				</div>
			</div>
			{/*right column*/}
			<LoadingRightColumn />
		</div>
	);
};