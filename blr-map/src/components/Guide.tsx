import { Legend } from "./MapComponent";

interface GuideProps {
  legend: Legend[];
  updateLayerVisibility: (layerName: string) => void;
}

const Guide = ({ legend, updateLayerVisibility }: GuideProps) => {
  const handleClick = (layerName: string) => {
    updateLayerVisibility(layerName);
  };

  return (
    <div className="guide">
      <h2>Legend</h2>
      {legend.map((item: Legend, index: number) => (
        <div key={index}>
          <span className="layer-name" onClick={() => handleClick(item.layerName)}>
            {item.layerName}
          </span>
          {/* <img src={item.symbol} alt={item.label} /> */}
        </div>
      ))}
    </div>
  );
};

export default Guide;
