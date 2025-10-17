import { MockedProvider } from "@apollo/client/testing";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  mocks?: any[];
  addTypename?: boolean;
}

const customRender = (
  ui: ReactElement,
  {
    mocks = [],
    addTypename = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={addTypename}>
      {children}
    </MockedProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
