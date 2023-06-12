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
  const [address, setAddress] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const serviceUrl =
    "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  const handleAddressInput = (inputAddress: string) => {
    setAddress(inputAddress);
  };

  const updateLayerVisibility = (layerName: string) => {
    const isVisible = visibleLayers.includes(layerName);

    if (isVisible) {
      setVisibleLayers((prevVisibleLayers) =>
        prevVisibleLayers.filter((layer) => layer !== layerName)
      );
    } else {
      setVisibleLayers((prevVisibleLayers) => [
        ...prevVisibleLayers,
        layerName,
      ]);
    }
  };

  useEffect(() => {
    const setupMap = async () => {
      const [esriConfig, Map, MapView, FeatureLayer, locator, Graphic] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/rest/locator",
        "esri/Graphic",
      ]);

      const legendItems = [];

      esriConfig.apiKey = 'AAPK1637ff3ebf254471ab9a28b47a8a7ebetBHKpjaGpWHEtmgl6lIa1DeZieisAZPMBvawPi5frYF7ksc97kV5SgJxxyg766h5';

      const map = new Map({
        basemap: "osm",
      });

      const view = new MapView({
        container: MapElement.current,
        map: map,
        center: [27.9534, 53.7098],
        zoom: 7,
      });

      const waterwaysLayer = new FeatureLayer({
        url: LayerURLs.Waterways,
        visible: visibleLayers.includes("Waterways"),
      });

      const roadsLayer = new FeatureLayer({
        url: LayerURLs.Roads,
        visible: visibleLayers.includes("Roads"),
      });

      const touristLayer = new FeatureLayer({
        url: LayerURLs.Tourist,
        visible: visibleLayers.includes("Tourist"),
      });

      const botanicLayer = new FeatureLayer({
        url: LayerURLs.Botanic,
        visible: visibleLayers.includes("Botanic"),
      });

      map.addMany([waterwaysLayer, roadsLayer, touristLayer, botanicLayer]);

      const [
        waterwaysLayerInfo,
        roadsLayerInfo,
        touristLayerInfo,
        botanicLayerInfo,
      ] = await Promise.all([
        waterwaysLayer.load(),
        roadsLayer.load(),
        touristLayer.load(),
        botanicLayer.load(),
      ]);

      legendItems.push({
        layerName: "Waterways",
        symbol: waterwaysLayerInfo.renderer.symbol,
        label: "Waterways",
      });
      legendItems.push({
        layerName: "Roads",
        symbol: roadsLayerInfo.renderer.symbol,
        label: "Roads",
      });
      legendItems.push({
        layerName: "Tourist",
        symbol: touristLayerInfo.renderer.symbol,
        label: "Tourist",
      });
      legendItems.push({
        layerName: "Botanic",
        symbol: botanicLayerInfo.renderer.symbol,
        label: "Botanic",
      });

      setLegendInfo(legendItems);

      const params = {
        address: {
          address: address,
        },
      };

      const showResult = (results: [any]) => {
        if (results.length) {
          const result = results[0];
          const resultGraphic = new Graphic({
            symbol: {
              type: "simple-marker",
              color: "#821071",
              size: "12px",
              outline: {
                color: "#bc20d7",
                width: "2px"}
              },
            geometry: result.location,
            attributes: {
              title: "Address",
              address: result.address,
            },
            popupTemplate: {
              title: "{title}",
              content: `${address}<br>${result.location.longitude}`,
            },
          });
          view.graphics.add(resultGraphic);
          view.goTo({
            target: resultGraphic,
            zoom: 12,
          }).then(() => {
            view.popup.open({
              features: [resultGraphic],
              location: resultGraphic.geometry,
            });
          });
        } if(!results.length && address.length) {
          setIsVisible(true);
        }
      };

      locator.addressToLocations(serviceUrl, params).then((results: [object]) => {
        view.when(() => {
          showResult(results);
        });
      });

    };

    setupMap();
  }, [visibleLayers, address]);

  return (
    <>
      <div>
        <Search onAddressInput={handleAddressInput} />
        <Guide
          legend={legendInfo}
          updateLayerVisibility={updateLayerVisibility}
        />
      </div>
      <img className="default-icon" src="/circle.png" alt="default view" title="Map default view" onClick={() => (location.reload())}/>
      <div id="viewDiv" className="map" ref={MapElement}></div>
      <div className={ isVisible ? "notification" : "notification-hidden"}>
        <span>No such address!</span>
        <button className='ok-btn' onClick={toggleVisibility}>OK</button>
      </div>
    </>
  );
};

export default MapComponent;
