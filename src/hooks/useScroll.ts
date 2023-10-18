import React, {useEffect, useRef} from "react";

export const useScroll = (parentRef: React.MutableRefObject<HTMLElement>, childrenRef: React.MutableRefObject<HTMLElement>, callback: () => unknown) => {
	const observer = useRef<IntersectionObserver>();

	useEffect(() => {

		if (!parentRef.current || !childrenRef.current) {
			throw new Error("useScroll: parentRef and childrenRef must be defined");
		}

		const options = {
			root: parentRef.current,
			rootMargin: "0px",
			threshold: 0
		}

		observer.current = new IntersectionObserver(([target]) => {
			if (target.isIntersecting) {
				callback();
			}
		}, options);
		(observer.current as IntersectionObserver).observe(childrenRef.current);

		return () => {
			observer.current?.disconnect();
		}
	}, [callback])
}