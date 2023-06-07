import Search from "./Search";
import Guide from "./Guide";
import { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const Map = () => {
  const MapElement = useRef(null);

  useEffect(() => {
    const setupMap = async () => {
      const [Map, MapView, FeatureLayer] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer'
      ]);

      const map = new Map({
        basemap: 'osm'
      });

      const view = new MapView({
        container: MapElement.current,
        map: map,
        center: [27.9534, 53.7098],
        zoom: 7
      });

      const waterwaysLayer = new FeatureLayer({
        url:
          'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Waterways_EU/FeatureServer/0'
      });

        map.add(waterwaysLayer);
        const isOSMAdded = map.basemap && map.basemap.id === 'osm';
        const isLayerAdded = map.layers.some((layer: FeatureLayer) => layer === waterwaysLayer);
  
        console.log('OSM basemap added:', isOSMAdded);
        console.log('FeatureLayer added:', isLayerAdded);
    };

    setupMap();
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
