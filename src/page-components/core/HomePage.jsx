import React from 'react';
import Link from 'next/link';

import '../HomePage-premium.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero-section text-center">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="display-4">Austin & Jordyn</h1>
          <p className="lead">Celebrating Love, Laughter & Happily Ever After</p>
        </div>
      </header>

      <main>
        <section className="video-section text-center">
          <h2 className="section-title">Our Wedding Day Highlights</h2>
          <p className="section-subtitle">
            Relive the magic of our special day through this beautiful video capturing our most
            cherished moments, from the first look to the last dance.
          </p>
          <div className="video-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              className="embed-responsive embed-responsive-16by9"
              style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}
            >
              <iframe
                src="https://www.youtube.com/embed/ZOIRb_ghdh0"
                title="Austin & Jordyn's Wedding Day Highlights - A Love Story"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>
        </section>

        <section className="our-story-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="section-title">Our Love Story</h2>
                <p>
                  It all began with a serendipitous encounter at a cozy coffee shop, where two
                  hearts discovered they beat to the same rhythm. What started as casual
                  conversation over lattes blossomed into a beautiful romance filled with
                  spontaneous adventures, countless inside jokes, and the kind of laughter that
                  makes your cheeks hurt.
                </p>
                <p>
                  Through every season of life, we've been each other's biggest cheerleaders,
                  closest confidants, and favorite adventure partners. Our journey together has been
                  a tapestry woven with late-night conversations, shared dreams, quiet moments of
                  pure contentment, and an unshakeable faith in our future together.
                </p>
                <p>
                  Now, as we embark on this incredible new chapter as husband and wife, our hearts
                  are overflowing with excitement and gratitude. Thank you for being part of our
                  story - your love and support mean absolutely everything to us.
                </p>
              </div>
              <div className="col-lg-6 text-center">
                <picture>
                  <source srcSet="/images/engagement/PoradaProposal-11.webp" type="image/webp" />
                  <img
                    src="/images/engagement/PoradaProposal-11.webp"
                    alt="Austin and Jordyn during their romantic engagement session"
                    className="img-fluid rounded-circle shadow-lg"
                    loading="eager"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <section className="explore-section text-center">
          <div className="container">
            <h2 className="section-title">Explore Our Wedding Journey</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">✨ Memory Gallery</h3>
                    <p className="card-text">
                      Dive into our photo and video collection from the big day! Upload your own
                      candid shots and help us capture every magical moment from every angle.
                    </p>
                    <Link href="/album" className="btn btn-primary">
                      Browse Memories
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">💕 Digital Guestbook</h3>
                    <p className="card-text">
                      Share your favorite memory from our special day, leave us some marriage
                      advice, or just say hello! We love reading every single message.
                    </p>
                    <Link href="/guestbook" className="btn btn-primary">
                      Leave Your Mark
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">🌍 Guest Location Map</h3>
                    <p className="card-text">
                      See the amazing places our loved ones traveled from to celebrate with us. Our
                      hearts are full knowing how far love can reach!
                    </p>
                    <Link href="/map" className="btn btn-primary">
                      Explore the Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
