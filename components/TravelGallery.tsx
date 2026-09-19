export default function TravelGallery() {
  return (
    <section className="galleryStrip">
      <div className="container">
        <div className="head">
          <div>
            <div className="ey">ON THE ROAD</div>
            <h2>A glimpse of the journey.</h2>
          </div>
          <p>A restrained visual strip inspired by the reference site&apos;s travel-gallery treatment.</p>
        </div>
        <div className="galleryGrid">
          <div className="galleryTile">
            <span>City rides</span>
          </div>
          <div className="galleryTile">
            <span>Hill escapes</span>
          </div>
          <div className="galleryTile">
            <span>Airport</span>
          </div>
          <div className="galleryTile">
            <span>Outstation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
