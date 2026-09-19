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

      {/* Enhanced Promise Strip */}
      <section className="bg-gradient-to-r from-[#0d342e] via-[#123f38] to-[#184d44] text-white py-10 border-y border-[#1f594f] shadow-inner relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#62c33a]/15 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#62c33a]/10 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                🛡️
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Trust
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">Verified chauffeurs</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                ✨
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Comfort
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">Sanitized AC cabs</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                🔒
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Safety
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">Live ride tracking</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                🏷️
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Reliability
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">Fixed clear fares</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                ⏱️
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Punctuality
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">Guaranteed on-time</span>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#62c33a]/50 hover:bg-white/10 transition-all group">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#89df63] flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 group-hover:bg-[#62c33a] group-hover:text-[#123f38] transition-all shadow-sm">
                💬
              </span>
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#aee27d] transition-colors">
                Support
              </span>
              <span className="text-[11px] text-[#a1b5ae] mt-0.5">24×7 WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comfort Section */}
      <section className="comfort">
        <div className="container comfortGrid">
          <div className="comfortCopy">
            <div className="ey">WHY D&amp;G EXPRESS CABS</div>
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
