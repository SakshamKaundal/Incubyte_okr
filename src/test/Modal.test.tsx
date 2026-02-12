import { render, screen } from "@testing-library/react";
import Modal from "../components/ui/Modal";
import { describe } from "vitest";
import { it,expect } from "vitest";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal isOpen={false}>
        <div>Inside</div>
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
    // expect(screen.getByText("Inside")).not.toBeInTheDocument();
  });

  it("renders children when open", () => {
    render(
      <Modal isOpen={true}>
        <div>Inside</div>
      </Modal>
    );
    expect(screen.getByText("Inside")).toBeInTheDocument();
  });
});


