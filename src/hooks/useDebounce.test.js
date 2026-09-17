import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should return the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("pikachu", 300));

        expect(result.current).toBe("pikachu");
    });

    it("should not update the value before the delay has passed", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "pikachu" } }
        );
        rerender({ value: "charmander" });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current).toBe("pikachu");
    });

    it("should clear the previous timeout when the value changes again before it fires", () => {
        const { rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "pikachu" } }
        );
        expect(jest.getTimerCount()).toBe(1);

        rerender({ value: "charmander" });

        expect(jest.getTimerCount()).toBe(1);
    });

    it("should not leave a pending timeout once unmounted", () => {
        const { unmount } = renderHook(() => useDebounce("pikachu", 300));
        expect(jest.getTimerCount()).toBe(1);

        unmount();

        expect(jest.getTimerCount()).toBe(0);
    });

    it("should update the value once the delay has fully passed", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "pikachu" } }
        );
        rerender({ value: "charmander" });

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current).toBe("charmander");
    });
});
