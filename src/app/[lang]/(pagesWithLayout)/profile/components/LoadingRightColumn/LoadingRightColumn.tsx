import React from 'react';

export const LoadingRightColumn = () => {
	return (
		<div style={{width: '635px', marginTop: '5px', display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
			<div style={{display: 'flex', flexFlow: 'column', width: '615px', borderBottom: '1px solid var(--colors-hover)', padding: '15px 15px 15px 0', marginLeft: '15px'}}>
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
	);
}