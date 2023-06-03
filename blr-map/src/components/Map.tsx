import Search from "./Search";
import Guide from "./Guide";
import { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import MapView from "@arcgis/core/views/MapView.js";

const Map = () => {
  const MapElement = useRef(null);

  useEffect(() => {
    let view: MapView | null;

    loadModules(["esri/views/MapView", "esri/WebMap"], { css: true }).then(
      ([MapView, WebMap]) => {
        const webMap = new WebMap({
          basemap: "osm",
          portalUrl: "https://www.arcgis.com",
        });
        view = new MapView({
          map: webMap,
          center: [],
          zoom: 8,
          container: MapElement.current,
        });
      }
    );
    return () => {
      if (!view) {
        view = null;
      }
    };
  }, []);

  return (
    <>
      <div>
        <Search />
        <Guide />
      </div>
      <div className="map" ref={MapElement}></div>
    </>
  );
};

export default Map;
