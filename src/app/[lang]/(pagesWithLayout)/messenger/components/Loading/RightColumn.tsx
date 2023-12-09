import {LoadingChats} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Loading/LoadingChats";

export const RightColumn = () => {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			height: 'calc(100% - 5px)',
			width: '32%',
			paddingLeft: '1%',
			borderLeft: '1px solid #E6E6E6',
			overflow: 'hidden'
		}}>
			<div style={{display: 'flex', paddingTop: '10px', marginBottom: '10px'}}>
				<div style={{height: '34px', width: '246px', borderRadius: '8px', marginRight: '5px'}}
					 className={"skeleton"}></div>
				<div style={{height: '32px', width: '32px', borderRadius: '4px'}} className={"skeleton"}></div>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px',
					marginRight: '5px',
					marginBottom: '5px'
				}} className={"skeleton"}></div>
				<LoadingChats/>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px'
				}} className={"skeleton"}></div>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px',
					marginRight: '5px',
					marginBottom: '5px'
				}} className={"skeleton"}></div>
				<LoadingChats/>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px'
				}} className={"skeleton"}></div>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px'
				}} className={"skeleton"}></div>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px',
					marginRight: '5px',
					marginBottom: '5px'
				}} className={"skeleton"}></div>
				<LoadingChats/>
			</div>
			<div style={{
				display: 'flex',
				width: '252px',
				borderRadius: '12px',
				marginBottom: '5px',
				alignItems: 'center',
				boxShadow: 'var(--box-shadow)',
				justifyContent: 'center',
				flexFlow: 'column',
				padding: '7px 10px',
				backgroundColor: 'var(--colors-ui-base)'
			}}>
				<div style={{
					height: '34px',
					width: '246px',
					borderRadius: '8px',
					marginRight: '5px',
					marginBottom: '5px'
				}} className={"skeleton"}></div>
				<LoadingChats/>
			</div>
		</div>
	);
};
