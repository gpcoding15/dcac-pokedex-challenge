import { render } from "@testing-library/react";
import { useIntersectionTrigger } from "./useIntersectionTrigger";

const TestTarget = ({ onIntersect, enabled }) => {
    const ref = useIntersectionTrigger(onIntersect, { enabled });
    return <div ref={ref} />;
};

const TestWithoutTarget = ({ onIntersect }) => {
    useIntersectionTrigger(onIntersect);
    return null;
};

describe("useIntersectionTrigger", () => {
    let observeMock;
    let unobserveMock;
    let observerCallback;

    beforeEach(() => {
        observeMock = jest.fn();
        unobserveMock = jest.fn();
        global.IntersectionObserver = jest.fn((callback) => {
            observerCallback = callback;
            return { observe: observeMock, unobserve: unobserveMock, disconnect: jest.fn() };
        });
    });

    it("should observe the target element once mounted", () => {
        render(<TestTarget onIntersect={jest.fn()} />);

        expect(observeMock).toHaveBeenCalledTimes(1);
    });

    it("should call the callback when the target intersects", () => {
        const onIntersect = jest.fn();
        render(<TestTarget onIntersect={onIntersect} />);

        observerCallback([{ isIntersecting: true }]);

        expect(onIntersect).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback when the target is not intersecting", () => {
        const onIntersect = jest.fn();
        render(<TestTarget onIntersect={onIntersect} />);

        observerCallback([{ isIntersecting: false }]);

        expect(onIntersect).not.toHaveBeenCalled();
    });

    it("should not create an observer when disabled", () => {
        render(<TestTarget onIntersect={jest.fn()} enabled={false} />);

        expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    it("should unobserve the target when unmounted", () => {
        const { unmount } = render(<TestTarget onIntersect={jest.fn()} />);

        unmount();

        expect(unobserveMock).toHaveBeenCalledTimes(1);
    });

    it("should not observe or unobserve anything when no target element was ever attached", () => {
        const { unmount } = render(<TestWithoutTarget onIntersect={jest.fn()} />);

        unmount();

        expect(observeMock).not.toHaveBeenCalled();
        expect(unobserveMock).not.toHaveBeenCalled();
    });
});
