import type { User } from "#/features/auth/auth.model.ts";

export const loginUser = async (username: string, password: string): Promise<User> => {
    const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(error.detail ?? "Login failed");
    }

    return response.json();
};

export const registerUser = async (username: string, email: string, password: string, confirm_password: string): Promise<User> => {
    const response = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password, confirm_password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Registration failed" }));
        throw new Error(error.detail ?? "Registration failed");
    }

    return response.json();
};

export const logoutUser = async (): Promise<void> => {
    await fetch("/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
    });
};

export const getMe = async (): Promise<User | null> => {
    const response = await fetch("/api/v1/users/me", {
        credentials: "include",
    });

    if (!response.ok) return null;

    return response.json();
};
