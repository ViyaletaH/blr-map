const Footer = () => {
  const gitOpen = () => {
    window.open("https://github.com/ViyaletaH", '_blank');
  };

  return (
    <div className="footer">
      <span className='author' onClick={gitOpen}>GitHub</span>
      <span className="year">2023 ©</span>
    </div>
  );
};

export default Footer;
