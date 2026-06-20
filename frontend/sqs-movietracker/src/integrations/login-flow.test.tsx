import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "#/features/auth/auth.context.tsx";
import { loginUser } from "#/features/auth/auth.queries.ts";
import { Route } from "#/routes/login.tsx";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
    createFileRoute: () => (config: unknown) => config,
    Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
    useNavigate: () => navigate,
}));

vi.mock("#/features/auth/auth.context.tsx", () => ({
    useAuth: vi.fn(),
}));

vi.mock("#/features/auth/auth.queries.ts", () => ({
    loginUser: vi.fn(),
}));

const user = { id: 1, username: "movieFan", email: "fan@example.com" };

function routeComponent(route: unknown) {
    return (route as { component: ComponentType }).component;
}

describe("login integration flow", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("submits credentials, logs in the user, and navigates home", async () => {
        const login = vi.fn();
        vi.mocked(useAuth).mockReturnValue({ user: null, login, logout: vi.fn() });
        vi.mocked(loginUser).mockResolvedValue(user);
        const LoginPage = routeComponent(Route);

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "movieFan" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "supersecret" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

        await waitFor(() =>
            expect(loginUser).toHaveBeenCalledWith("movieFan", "supersecret"),
        );
        expect(login).toHaveBeenCalledWith(user);
        expect(navigate).toHaveBeenCalledWith({ to: "/" });
    });
});
