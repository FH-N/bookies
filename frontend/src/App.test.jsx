import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";

// Mock the authentication hook
vi.mock("./auth", () => ({
  useAuthentication: () => ({
    isAuthorized: false, // Set this to true or false to test different scenarios
  }),
}));

// Mock the NavBar to simplify the test output
vi.mock("./components/ui/Navbar", () => ({
  default: () => <nav>Mocked NavBar</nav>,
}));

describe("App Routing", () => {
  it("renders the Landing Page for unauthenticated users visiting '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/register/i) // Adjust based on the actual text in LandingPage
    ).toBeInTheDocument();
  });

  it("renders the Home Page for authenticated users visiting '/'", () => {
    vi.mocked(require("./auth").useAuthentication).mockReturnValueOnce({
      isAuthorized: true,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/home page/i)).toBeInTheDocument(); // Adjust based on the actual text in HomePage
  });

  it("renders the Not Found page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/not found/i)).toBeInTheDocument(); // Adjust based on the actual text in NotFound
  });

  it("renders the Book Search page when visiting '/search'", () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/search page/i)).toBeInTheDocument(); // Adjust based on the actual text in BookSearch
  });

  it("renders the Book Info page when visiting '/book/:id'", () => {
    render(
      <MemoryRouter initialEntries={["/book/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/book info/i)).toBeInTheDocument(); // Adjust based on the actual text in BookInfo
  });

  it("renders the Login Page for unauthenticated users visiting '/login'", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/login/i) // Adjust based on the actual text in LandingPage with login method
    ).toBeInTheDocument();
  });

  it("redirects authenticated users away from '/login' to '/'", () => {
    vi.mocked(require("./auth").useAuthentication).mockReturnValueOnce({
      isAuthorized: true,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/home page/i)).toBeInTheDocument(); // Adjust based on HomePage text
  });
});
