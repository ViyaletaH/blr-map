import Search from "./Search";
import Guide from "./Guide";
import { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

enum LayerURLs {
  Waterways = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Waterways_EU/FeatureServer/0',
  Roads = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Highways_EU/FeatureServer/0',
  Tourist = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0',
  Botanic = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Leisure_EU/FeatureServer/0',
}


const MapComponent = () => {
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
        url: LayerURLs.Waterways
      });

      const roadsLayer = new FeatureLayer({
        url: LayerURLs.Roads
      });

      const touristLayer = new FeatureLayer({
        url: LayerURLs.Tourist
      })

      const botanicLayer = new FeatureLayer({
        url: LayerURLs.Botanic
      })

        map.addMany([waterwaysLayer, roadsLayer, touristLayer, botanicLayer]);

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

export default MapComponent;
