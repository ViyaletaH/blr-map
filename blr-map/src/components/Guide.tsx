import { Legend } from "./MapComponent";
import { useState } from "react";

interface GuideProps {
  legend: Legend[];
  updateLayerVisibility: (layerName: string) => void;
}

const Guide = ({ legend, updateLayerVisibility }: GuideProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleChoice = (layerName: string) => {
    if (chosen === layerName) {
      setChosen(null);
    } else {
      setChosen(layerName);
    }
  };

  const handleClick = (layerName: string) => {
    updateLayerVisibility(layerName);
    toggleChoice(layerName);
  };

  return (
    <div className="guide">
      <img className="guide-arrow" src="/arrow.png" alt="guiding list" onClick={toggleVisibility} title="Map guide"/>
      <div className={isVisible ? 'guide-list' : 'guide-list-hidden'}>
        <h2>Legend</h2>
        {legend.map((item: Legend, index: number) => (
          <div key={index}>
            <label>
            <input type="checkbox"
              className={chosen === item.layerName ? 'chosen-layer-name' : 'layer-name'}
              onClick={() => handleClick(item.layerName)}
            />
              {item.layerName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guide;
