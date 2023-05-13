import React, {useCallback, useEffect, useState} from "react";

export const useHovering = (ref: React.MutableRefObject<HTMLElement>) => {
	const [isHovering, setIsHovering] = useState(false);

	const on = useCallback(() => {
		setIsHovering(true);
	}, [])
	const off = useCallback(() => {
		setIsHovering(false);
	}, [])

	useEffect(() => {
		const node = ref.current;
		if (!node) {
			throw new Error("ref is unavailable");
		}

		node.addEventListener("mouseenter", on);
		node.addEventListener("mousemove", on);
		node.addEventListener("mouseleave", off);

		return () => {
			node.removeEventListener("mouseenter", on);
			node.removeEventListener("mousemove", on);
			node.removeEventListener("mouseleave", off);
		}
	}, [])

	return isHovering;
}