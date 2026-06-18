import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "#/features/auth/auth.context.tsx";
import { TopNav } from "./Topbar";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
    Link: ({ children, to, ...props }: React.ComponentProps<"a"> & { to: string }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
    useNavigate: () => navigate,
}));

vi.mock("#/features/auth/auth.context.tsx", () => ({
    useAuth: vi.fn(),
}));

const user = { id: 1, username: "movieFan", email: "fan@example.com" };

describe("TopNav", () => {
    beforeEach(() => {
        globalThis.matchMedia = vi.fn().mockReturnValue({ matches: false });
        document.documentElement.className = "";
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("logs out the current user and navigates home", async () => {
        const logout = vi.fn().mockResolvedValue(undefined);
        vi.mocked(useAuth).mockReturnValue({ user, login: vi.fn(), logout });

        render(<TopNav />);

        expect(screen.getByText("movieFan")).toBeTruthy();
        fireEvent.click(screen.getByTitle("Sign out"));

        await waitFor(() => expect(logout).toHaveBeenCalled());
        expect(navigate).toHaveBeenCalledWith({ to: "/" });
    });

    it("switches between light and dark theme classes", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn() });

        render(<TopNav />);

        const [lightButton, darkButton] = screen.getAllByRole("button");

        expect(document.documentElement.classList.contains("light")).toBe(true);

        fireEvent.click(darkButton);
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(document.documentElement.classList.contains("light")).toBe(false);

        fireEvent.click(lightButton);
        expect(document.documentElement.classList.contains("light")).toBe(true);
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
});
