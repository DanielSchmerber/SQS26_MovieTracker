import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getMe, logoutUser } from "./auth.queries";
import { AuthProvider, useAuth } from "./auth.context";

vi.mock("./auth.queries", () => ({
    getMe: vi.fn(),
    logoutUser: vi.fn(),
}));

const user = { id: 1, username: "movieFan", email: "fan@example.com" };
const nextUser = { id: 2, username: "newFan", email: "new@example.com" };

function AuthConsumer() {
    const { user: authUser, login, logout } = useAuth();

    return (
        <div>
            <span>{authUser?.username ?? "Guest"}</span>
            <button onClick={() => login(nextUser)}>Log in</button>
            <button onClick={() => void logout()}>Log out</button>
        </div>
    );
}

describe("AuthProvider", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("loads the current user on mount", async () => {
        vi.mocked(getMe).mockResolvedValue(user);

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>,
        );

        expect(screen.getByText("Guest")).toBeTruthy();
        expect(await screen.findByText("movieFan")).toBeTruthy();
        expect(getMe).toHaveBeenCalledTimes(1);
    });

    it("updates the context user when logging in and out", async () => {
        vi.mocked(getMe).mockResolvedValue(null);
        vi.mocked(logoutUser).mockResolvedValue(undefined);

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Log in" }));
        expect(screen.getByText("newFan")).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Log out" }));

        await waitFor(() => expect(logoutUser).toHaveBeenCalledTimes(1));
        expect(screen.getByText("Guest")).toBeTruthy();
    });
});
