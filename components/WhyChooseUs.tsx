import Link from "next/link";

export default function WhyChooseUs() {
  return (
    <>
      {/* Story / More Than A Cab Section */}
      <section className="section" id="why">
        <div className="container story">
          <div className="storyArt">🛣️</div>
          <div>
            <div className="ey">MORE THAN A CAB</div>
            <h2>Making travel feel less complicated.</h2>
            <p>
              From catching an early flight to taking a weekend break, your booking should be the easiest part of the journey.
            </p>
            <div className="tick">✓ Clear fares before booking</div>
            <div className="tick">✓ Multiple vehicle choices</div>
            <div className="tick">✓ Airport, intercity and tour options</div>
          </div>
        </div>
      </section>

      {/* Editorial Band */}
      <section className="editorialBand">
        <div className="container editorialGrid">
          <div className="editorialVisual">🚘</div>
          <div className="editorialCopy">
            <div className="ey">TRAVEL TOGETHER, RIDE BETTER</div>
            <h2>A cab for every kind of journey.</h2>
            <p>
              Keep the experience simple: choose the trip, pick the cab and travel at your own pace. This section adds the editorial storytelling feel from the reference without making the homepage busy.
            </p>
            <div className="editorialList">
              <div>Airport transfers with room for luggage</div>
              <div>Intercity rides for families and groups</div>
              <div>Day-wise tour packages with clear cab pricing</div>
              <div>Flexible pickup details and direct booking support</div>
            </div>
            <Link className="btn dark" href="/packages">
              Explore tour packages
            </Link>
          </div>
        </div>
      </section>

      {/* Promise Strip */}
      <section className="promiseStrip">
        <div className="container promiseGrid">
          <div>Trust</div>
          <div>Comfort</div>
          <div>Safety</div>
          <div>Reliability</div>
          <div>Punctuality</div>
          <div>Support</div>
        </div>
      </section>

      {/* Comfort Section */}
      <section className="comfort">
        <div className="container comfortGrid">
          <div className="comfortCopy">
            <div className="ey">WHY RELAXCABS</div>
            <h2>Travel with comfort and trust.</h2>
            <p>
              Small details make long journeys better. These service promises are intentionally compact so they support the booking experience rather than compete with it.
            </p>
          </div>
          <div className="comfortCards">
            <div className="comfortCard">
              <div className="comfortIcon">✓</div>
              <div>
                <h3>Transparent booking</h3>
                <p>See the route, cab category and fare information before sending your request.</p>
              </div>
            </div>
            <div className="comfortCard">
              <div className="comfortIcon">🚕</div>
              <div>
                <h3>Right cab for the trip</h3>
                <p>Choose Sedan, Ertiga or Crysta where package pricing is available.</p>
              </div>
            </div>
            <div className="comfortCard">
              <div className="comfortIcon">☎</div>
              <div>
                <h3>Human support</h3>
                <p>Booking and WhatsApp options stay easy to find when you need assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
