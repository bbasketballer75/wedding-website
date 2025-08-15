import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Austin & Jordyn</h1>
          <p className="hero-subtitle">May 10, 2025</p>
          <p className="hero-description">
            Join us as we celebrate our love story and begin our journey as husband and wife.
          </p>
        </div>
      </header>

      <section className="welcome-section">
        <div className="container">
          <h2>Welcome to Our Wedding Website</h2>
          <p>
            We&apos;re so excited to share our special day with you! Here you&apos;ll find all the
            information you need about our wedding celebration.
          </p>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 4rem 2rem;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: 'Georgia', serif;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.8;
        }

        .welcome-section {
          padding: 4rem 2rem;
          background: #f7fafc;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .welcome-section h2 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .welcome-section p {
          font-size: 1.1rem;
          color: #4a5568;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .hero-section {
            padding: 2rem 1rem;
          }

          .welcome-section {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
