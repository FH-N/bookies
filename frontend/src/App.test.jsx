import { render, screen } from "@testing-library/react";
import App from "./App";
import { useAuthentication } from "./auth";

// Mock the useAuthentication hook
vi.mock("./auth", () => ({
  useAuthentication: vi.fn(),
}));

describe("App Component", () => {
  // it("renders the LandingPage when the user is not authorized", () => {
  //   useAuthentication.mockReturnValue({ isAuthorized: false });
  //   render(<App />);
  //   expect(screen.getByText(/register/i)).toBeInTheDocument();
  // });

  // it("renders the HomePage when the user is authorized", () => {
  //   useAuthentication.mockReturnValue({ isAuthorized: true });
  //   render(<App />);
  //   expect(screen.getByText(/home/i)).toBeInTheDocument();
  // });

  it("renders the NotFound page when the route does not exist", () => {
    // Mock isAuthorized to simulate any state
    useAuthentication.mockReturnValue({ isAuthorized: true });

    // Mock an App without actual routing middleware
    render(<App />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("renders the BookSearch component directly", () => {
    useAuthentication.mockReturnValue({ isAuthorized: true });

    render(<BookSearch />); // Directly test the component
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  it("renders RedirectGoogleAuth when login callback is triggered", () => {
    useAuthentication.mockReturnValue({ isAuthorized: false });

    render(<RedirectGoogleAuth />); // Directly test the component
    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });
});
