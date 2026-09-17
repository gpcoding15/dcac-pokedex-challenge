import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "./useOnlineStatus";

describe("useOnlineStatus", () => {
    it("should return true when the browser starts online", () => {
        Object.defineProperty(navigator, "onLine", { value: true, configurable: true });

        const { result } = renderHook(() => useOnlineStatus());

        expect(result.current).toBe(true);
    });

    it("should switch to false when the browser goes offline", () => {
        Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
        const { result } = renderHook(() => useOnlineStatus());

        act(() => {
            window.dispatchEvent(new Event("offline"));
        });

        expect(result.current).toBe(false);
    });

    it("should switch back to true when the browser comes back online", () => {
        Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
        const { result } = renderHook(() => useOnlineStatus());

        act(() => {
            window.dispatchEvent(new Event("online"));
        });

        expect(result.current).toBe(true);
    });

    it("should remove the online and offline listeners when unmounted", () => {
        const addEventListenerSpy = jest.spyOn(window, "addEventListener");
        const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = renderHook(() => useOnlineStatus());
        const [, onlineHandler] = addEventListenerSpy.mock.calls.find(([event]) => event === "online");
        const [, offlineHandler] = addEventListenerSpy.mock.calls.find(([event]) => event === "offline");

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("online", onlineHandler);
        expect(removeEventListenerSpy).toHaveBeenCalledWith("offline", offlineHandler);

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });
});
