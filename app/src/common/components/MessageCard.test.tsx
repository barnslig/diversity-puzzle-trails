import * as React from "react";
import render from "../testing/render";

import MessageCard from "./MessageCard";

it("renders correctly", () => {
  const { container } = render(
    <MessageCard
      message={{
        type: "message",
        id: "test-123",
        attributes: {
          createdAt: "2021-05-14T12:58:59.063Z",
          message: "Test 123",
        },
      }}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
