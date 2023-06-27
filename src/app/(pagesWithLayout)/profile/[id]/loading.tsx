import React, {} from 'react';

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
			<div style={{width: '635px', marginTop: '5px', display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
				<div style={{display: 'flex', flexFlow: 'column', width: '615px', marginTop: '10px', borderRadius: '20px', border: '1px solid var(--colors-hover)', padding: '15px'}}>
					<div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
						<div className={"skeleton"} style={{width: '250px', height: '22px', borderRadius: '8px', marginRight: '5px'}}></div>
						<div className={"skeleton"} style={{width: '280px', height: '22px', borderRadius: '8px'}}></div>
					</div>
					<div className={"skeleton"} style={{width: '600px', height: '22px', borderRadius: '8px'}}></div>
					<div style={{display: 'flex', flexFlow: 'column', width: '100%', margin: '10px 0 0 0'}}>
						<div style={{display: 'flex', marginBottom: '10px'}}>
							<div className={"skeleton"} style={{width: '170px', height: '22px', borderRadius: '8px', marginRight: '10px'}}></div>
							<div className={"skeleton"} style={{width: '300px', height: '22px', borderRadius: '8px'}}></div>
						</div>
						<div style={{display: 'flex', marginBottom: '10px'}}>
							<div className={"skeleton"} style={{width: '170px', height: '22px', borderRadius: '8px', marginRight: '10px'}}></div>
							<div className={"skeleton"} style={{width: '300px', height: '22px', borderRadius: '8px'}}></div>
						</div>
						<div style={{display: 'flex'}}>
							<div className={"skeleton"} style={{width: '170px', height: '22px', borderRadius: '8px', marginRight: '10px'}}></div>
							<div className={"skeleton"} style={{width: '300px', height: '22px', borderRadius: '8px'}}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};