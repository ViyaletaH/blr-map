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

      const roadsLayer = new FeatureLayer({
        url: 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Highways_EU/FeatureServer'
      });

      const touristLayer = new FeatureLayer({
        url: 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer'
      })

      const botanicLayer = new FeatureLayer({
        url: 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Leisure_EU/FeatureServer'
      })

        map.addMany([waterwaysLayer, roadsLayer, touristLayer, botanicLayer]);
        const isOSMAdded = map.basemap && map.basemap.id === 'osm';
        const isWaterAdded = map.layers.some((layer: FeatureLayer) => layer === waterwaysLayer);
        const isRoadAdded = map.layers.some((layer: FeatureLayer) => layer === roadsLayer);
        const isTouristAdded = map.layers.some((layer: FeatureLayer) => layer === touristLayer);
        const isBotanicAdded = map.layers.some((layer: FeatureLayer) => layer === botanicLayer);

  
        console.log('OSM basemap added:', isOSMAdded);
        console.log('water added:', isWaterAdded);
        console.log('road added:', isRoadAdded);
        console.log('tourist added:', isTouristAdded);
        console.log('botanic added:', isBotanicAdded);

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
