import styles from './CommentBlock.module.scss';
import {FC, memo} from "react";

interface NoCommentsProps {
	text: string;
}

export const NoComments: FC<NoCommentsProps> = memo<NoCommentsProps>(({text}) => {

	return (
		<div className={styles.noCommentsBlock}>{text}</div>
	);
});
