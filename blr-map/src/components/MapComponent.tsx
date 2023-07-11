import Search from './Search';
import Guide from './Guide';
import { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import LayerList from '@arcgis/core/widgets/LayerList';

enum LayerURLs {
  Waterways = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Waterways_EU/FeatureServer/0',
  Roads = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Highways_EU/FeatureServer/0',
  Tourist = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0',
  Botanic = 'https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Leisure_EU/FeatureServer/0',
}

export interface Legend {
  layerName: string;
  symbol: string;
  label: string;
}

const MapComponent = () => {
  const MapElement = useRef(null);
  const [address, setAddress] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [zoomValue, setZoomValue] = useState<number>(7);
  const [center, setCenter] = useState<number[]>([27.9534, 53.7098]);
  const layerListRef = useRef<LayerList | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const serviceUrl = 'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer';

  const handleAddressInput = (address: string) => {
    setAddress(address);
  };

   useEffect(() => {
    const setupMap = async () => {
      const [esriConfig, Map, MapView, FeatureLayer, locator, Graphic, LayerList] = await loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/rest/locator',
        'esri/Graphic',
        'esri/widgets/LayerList'
      ]);

      esriConfig.apiKey =
        'AAPK1637ff3ebf254471ab9a28b47a8a7ebetBHKpjaGpWHEtmgl6lIa1DeZieisAZPMBvawPi5frYF7ksc97kV5SgJxxyg766h5';

      const map = new Map({
        basemap: 'osm',
      });

      const view = new MapView({
        container: MapElement.current,
        map: map,
        center: center,
        zoom: zoomValue,
      });

      view.when(() => {
        const layerList = new LayerList({
          view: view,
        });

        view.ui.add(layerList, 'top-right');
        layerListRef.current = layerList;
      });

      view.watch('zoom', (newValue: number) => {
        if (newValue) {
          setZoomValue(newValue);
        }
      });

      view.watch('center', (newValue: [number]) => {
        if (newValue) {
          setCenter(newValue);
        }
      });

      const waterwaysLayer = new FeatureLayer({
        url: LayerURLs.Waterways,
      });

      const roadsLayer = new FeatureLayer({
        url: LayerURLs.Roads,
      });

      const touristLayer = new FeatureLayer({
        url: LayerURLs.Tourist,
      });

      const botanicLayer = new FeatureLayer({
        url: LayerURLs.Botanic,
      });

      map.addMany([waterwaysLayer, roadsLayer, touristLayer, botanicLayer]);

      const params = {
        address: {
          address: address,
        },
      };

      const showResult = (results: [any]) => {
        console.log(results);
        if (results.length) {
          const result = results[0];
          const resultGraphic = new Graphic({
            symbol: {
              type: 'simple-marker',
              color: '#821071',
              size: '12px',
              outline: {
                color: '#bc20d7',
                width: '2px',
              },
            },
            geometry: result.location,
            attributes: {
              title: 'Address',
              address: result.address,
            },
            popupTemplate: {
              title: '{title}',
              content: `${address}<br>${result.location.longitude}`,
            },
          });
          view.graphics.add(resultGraphic);
          view
            .goTo({
              target: resultGraphic,
              zoom: 12,
            })
            .then(() => {
              view.popup.open({
                features: [resultGraphic],
                location: resultGraphic.geometry,
              });
            });
        }
        if (!results.length && address.length) {
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
  }, []);

  return (
    <>
      <div>
        <Search onAddressInput={handleAddressInput} />
        <Guide />
      </div>
      <img
        className="default-icon"
        src="/circle.png"
        alt="default view"
        title="Map default view"
        onClick={() => location.reload()}
      />
      <div id="viewDiv" className="map" ref={MapElement}></div>
      <div className={isVisible ? 'notification' : 'notification-hidden'}>
        <span>No such address!</span>
        <button className="ok-btn" onClick={toggleVisibility}>
          OK
        </button>
      </div>
    </>
  );
};

export default MapComponent;
