import Image from 'next/image';
import './WeddingPartyPage.css';

const WeddingPartyPage = () => {
  const bridesmaids = [
    { name: 'Brinnah Porada', image: '/images/wedding-party/bridesmaids/brinnah-porada.webp' },
    { name: 'Caitie Helsel', image: '/images/wedding-party/bridesmaids/caitie-helsel.webp' },
    { name: 'Emily Aurandt', image: '/images/wedding-party/bridesmaids/emily-aurandt.webp' },
    { name: 'Hannah Porada', image: '/images/wedding-party/bridesmaids/hannah-porada.webp' },
    { name: 'Lexi Ferg', image: '/images/wedding-party/bridesmaids/lexi-ferg.webp' },
    { name: 'Maria McCray', image: '/images/wedding-party/bridesmaids/maria-mccray.webp' },
    { name: 'Mic', image: '/images/wedding-party/bridesmaids/mic.webp' },
  ];

  const groomsmen = [
    { name: 'Alex Molnar', image: '/images/wedding-party/groomsmen/alex-molnar.webp' },
    { name: 'Brosonan McCray', image: '/images/wedding-party/groomsmen/brosonan-mccray.webp' },
    { name: 'Ean Pringle', image: '/images/wedding-party/groomsmen/ean-pringle.webp' },
    { name: 'Eddie Migut', image: '/images/wedding-party/groomsmen/eddie-migut.webp' },
    { name: 'Ian Porada', image: '/images/wedding-party/groomsmen/ian-porada.webp' },
    { name: 'Nate Berkebile', image: '/images/wedding-party/groomsmen/nate-berkebile.webp' },
    { name: 'Tyler Sharpe', image: '/images/wedding-party/groomsmen/tyler-sharpe.webp' },
  ];

  return (
    <div className="wedding-party-page">
      <h2 className="section-title">Our Amazing Wedding Party</h2>
      <p className="section-subtitle">
        These incredible souls stood by our side on the most important day of our lives. Our hearts
        are full of gratitude for their friendship, love, and support - not just on our wedding day,
        but throughout our entire journey together.
      </p>
      <div className="party-section">
        <h3 className="subheading">The Beautiful Bridesmaids</h3>
        <p className="party-description">
          Jordyn's chosen sisters - the women who have laughed with her, cried with her, and
          celebrated every milestone along the way.
        </p>
        <div className="party-grid">
          {bridesmaids.map((member) => (
            <div key={member.name} className="party-member-card">
              <Image
                src={member.image}
                alt={member.name}
                className="party-member-image"
                width={300}
                height={400}
                sizes="(max-width: 768px) 150px, 300px"
                priority={false}
              />
              <h4 className="party-member-name">{member.name}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="party-section">
        <h3 className="subheading">The Handsome Groomsmen</h3>
        <p className="party-description">
          Austin's chosen brothers - the guys who have been there through thick and thin, ready with
          a joke, a helping hand, or an epic adventure at a moment's notice.
        </p>
        <div className="party-grid">
          {groomsmen.map((member) => (
            <div key={member.name} className="party-member-card">
              <img src={member.image} alt={member.name} className="party-member-image" />
              <h4 className="party-member-name">{member.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeddingPartyPage;
