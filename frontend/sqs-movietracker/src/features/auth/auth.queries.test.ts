import { afterEach, describe, expect, it, vi } from "vitest";

import { getMe, loginUser, logoutUser, registerUser } from "./auth.queries";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
}

describe("auth queries", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("logs in with username and password", async () => {
        const user = { id: 1, username: "movieFan", email: "fan@example.com" };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(user));
        vi.stubGlobal("fetch", fetchMock);

        await expect(loginUser("movieFan", "supersecret")).resolves.toEqual(user);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username: "movieFan", password: "supersecret" }),
        });
    });

    it("uses backend error details when login fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(jsonResponse({ detail: "Invalid credentials" }, { status: 401 })),
        );

        await expect(loginUser("movieFan", "wrongpass")).rejects.toThrow(
            "Invalid credentials",
        );
    });

    it("registers a new user", async () => {
        const user = { id: 2, username: "newFan", email: "new@example.com" };
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse(user));
        vi.stubGlobal("fetch", fetchMock);

        await expect(registerUser("newFan", "new@example.com", "supersecret")).resolves.toEqual(user);
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                username: "newFan",
                email: "new@example.com",
                password: "supersecret",
            }),
        });
    });

    it("returns null when the current user cannot be loaded", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Internal Server Error", { status: 500 })));

        await expect(getMe()).resolves.toBeNull();
    });

    it("posts to logout with credentials", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
        vi.stubGlobal("fetch", fetchMock);

        await logoutUser();
        expect(fetchMock).toHaveBeenCalledWith("/api/v1/users/logout", {
            method: "POST",
            credentials: "include",
        });
    });
});
