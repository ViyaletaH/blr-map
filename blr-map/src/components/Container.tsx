import Header from "./Header";
import Map from './Map';
import Footer from "./Footer";
import './styles.scss';

const Container = () => {
  return (
    <div className="container">
      <Header />
      <Map />
      <Footer />
    </div>
  );
};

export default Container;
