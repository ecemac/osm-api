import React from "react";
import ReactDOM from "react-dom";
import { screen, render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import App, { findBbox } from "./App";

afterEach(cleanup);

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});

it("matched snapshot", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders osm data", async () => {
  const fakeOsmData = {
    type: "FeatureCollection",
    features: [],
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeOsmData),
    })
  );

  global.fetch.mockRestore();
});

it("should render loading", () => {
  render(<App />);
  const loadingElement = screen.getByTestId("loading");
  expect(loadingElement).toBeInTheDocument();
  expect(loadingElement).toHaveTextContent("Loading...");
});

it("should return bbox", () => {
  const value = findBbox(0, 0);
  expect(value).toStrictEqual([-0.0025, -0.0025, 0.0025, 0.0025]);
});
