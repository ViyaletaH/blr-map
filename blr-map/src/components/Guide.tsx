import { useState } from 'react';

const Guide = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="guide">
      <img
        className="guide-arrow"
        src="/arrow.png"
        alt="guiding list"
        onClick={toggleVisibility}
        title="Map guide"
      />
      {/* <div className={isVisible ?  'esri-component esri-layer-list esri-widget esri-widget--panel' : 'guide-list-hidden'}/> */}
    </div>
  );
};

export default Guide;
