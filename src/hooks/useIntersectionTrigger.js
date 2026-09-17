import { useEffect, useRef } from "react";

export const useIntersectionTrigger = (onIntersect, { enabled = true } = {}) => {
    const targetRef = useRef(null);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onIntersect();
            }
        });

        const currentTarget = targetRef.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [onIntersect, enabled]);

    return targetRef;
};
