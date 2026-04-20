import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewsletterForm from "@/components/NewsletterForm";

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 200 }),
    );
  });
  afterEach(() => vi.restoreAllMocks());

  it("shows error when first name empty", async () => {
    render(<NewsletterForm />);
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/first name/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows error for invalid email", async () => {
    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/first name/i), "Matt");
    await userEvent.type(screen.getByPlaceholderText(/you@example/i), "bad-email");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts to /api/subscribe and shows thanks message on success", async () => {
    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/first name/i), "Matt");
    await userEvent.type(screen.getByPlaceholderText(/you@example/i), "matt@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByText(/you're on the list/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/subscribe",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "matt@example.com", firstName: "Matt" }),
      }),
    );
  });

  it("shows error when API responds non-ok", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));
    render(<NewsletterForm />);
    await userEvent.type(screen.getByPlaceholderText(/first name/i), "Matt");
    await userEvent.type(screen.getByPlaceholderText(/you@example/i), "matt@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
