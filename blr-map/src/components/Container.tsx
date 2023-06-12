import Header from './Header';
import Footer from './Footer';
import './styles.scss';
import MapComponent from './MapComponent';

const Container = () => {
  return (
    <div className="container">
      <Header />
      <MapComponent />
      <Footer />
    </div>
  );
};

export default Container;
