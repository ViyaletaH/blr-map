import Search from "./Search";
import Guide from "./Guide";
import { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";

enum LayerURLs {
  Waterways = "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Waterways_EU/FeatureServer/0",
  Roads = "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Highways_EU/FeatureServer/0",
  Tourist = "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0",
  Botanic = "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Leisure_EU/FeatureServer/0",
}

export interface Legend {
  layerName: string;
  symbol: string;
  label: string;
}

const MapComponent = () => {
  const MapElement = useRef(null);
  const [legendInfo, setLegendInfo] = useState<Legend[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const updateLayerVisibility = (layerName: string) => {
    alert(`before:${visibleLayers}`);
    const isVisible = visibleLayers.includes(layerName);

    if (isVisible) {
      setVisibleLayers(prevVisibleLayers =>
        prevVisibleLayers.filter(layer => layer !== layerName)
      );
      alert(`after:${visibleLayers}`);
    } else {
      setVisibleLayers(prevVisibleLayers => [...prevVisibleLayers, layerName]);
      alert(`after:${visibleLayers}`);
    }
  };

  useEffect(() => {
    const setupMap = async () => {
      const [Map, MapView, FeatureLayer] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
      ]);

      const legendItems = [];

      const map = new Map({
        basemap: "osm",
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [27.9534, 53.7098],
        zoom: 7,
      });

      const waterwaysLayer = new FeatureLayer({
        url: LayerURLs.Waterways,
        visible: visibleLayers.includes("Waterways")
      });

      const roadsLayer = new FeatureLayer({
        url: LayerURLs.Roads,
        visible: visibleLayers.includes("Roads")
      });

      const touristLayer = new FeatureLayer({
        url: LayerURLs.Tourist,
        visible: visibleLayers.includes("Tourist")
      });

      const botanicLayer = new FeatureLayer({
        url: LayerURLs.Botanic,
        visible: visibleLayers.includes("Botanic")
      });

      map.addMany([waterwaysLayer, roadsLayer, touristLayer, botanicLayer]);

      const [waterwaysLayerInfo, roadsLayerInfo, touristLayerInfo, botanicLayerInfo] = await Promise.all([
        waterwaysLayer.load(),
        roadsLayer.load(),
        touristLayer.load(),
        botanicLayer.load()
      ]);

      legendItems.push({
        layerName: "Waterways",
        symbol: waterwaysLayerInfo.renderer.symbol,
        label: "Waterways"
      });
      legendItems.push({
        layerName: "Roads",
        symbol: roadsLayerInfo.renderer.symbol,
        label: "Roads"
      });
      legendItems.push({
        layerName: "Tourist",
        symbol: touristLayerInfo.renderer.symbol,
        label: "Tourist"
      });
      legendItems.push({
        layerName: "Botanic",
        symbol: botanicLayerInfo.renderer.symbol,
        label: "Botanic"
      });

      setLegendInfo(legendItems);

      console.log(botanicLayerInfo.renderer.symbol)

    };

    setupMap();
  }, [visibleLayers]);

  return (
    <>
      <div>
        <Search />
        <Guide legend={legendInfo} updateLayerVisibility={updateLayerVisibility} />
      </div>
      <div id="viewDiv" className="map" ref={MapElement}></div>
    </>
  );
};

export default MapComponent;
