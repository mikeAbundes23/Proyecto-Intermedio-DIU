import React from 'react';
import './Home.css';
import image1 from '../../images/carousel-home-fondo.png';
import image2 from '../../images/home2.jpg';
import image3 from '../../images/home3.jpg';
import Navbar from '../Navbar/Navbar';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Smarthabits - Home</title>
      </Helmet>
      <Navbar/>
      {/* Primera sección: Texto centrado */}
      <section className="text-center my-5">
        <p className='home-title'>Create Life Changing Habits</p>
      </section>

      {/* Segunda sección: Carrusel de imágenes */}
      <section className="carousel-section">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={image1} className="d-block w-100" alt="Imagen 1" />
            </div>
            <div className="carousel-item">
              <img src={image2} className="d-block w-100" alt="Imagen 2" />
            </div>
            <div className="carousel-item">
              <img src={image3} className="d-block w-100" alt="Imagen 3" />
            </div>
          </div>

          {/* Controles del carrusel */}
          <button id="prev" className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span id="prevIcon" className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button id="next" className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span id="nextIcon" className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Tercera sección: Texto debajo del carrusel */}
      <section className="text-center my-5">
        <p className='home-text'>Become your true self</p>
      </section>
    </div>
  );
};

export default Home;
