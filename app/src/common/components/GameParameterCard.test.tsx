import * as React from "react";
import render from "../testing/render";

import GameParameterCard from "./GameParameterCard";

it("renders correctly", () => {
  const { container } = render(
    <GameParameterCard
      title="Spielstand"
      description="Der Status eurer gemeinsamen Mission. Achtet darauf, dass kein Wert 0 erreicht!"
    >
      <div>hypothetical GameParameter</div>
      <div>hypothetical GameParameter</div>
    </GameParameterCard>
  );
  expect(container.firstChild).toMatchSnapshot();
});
