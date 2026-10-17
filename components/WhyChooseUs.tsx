import React from "react";
import Image from "next/image";

export default function WhyChooseUs() {
  const whyPoints = [
    { title: "2-Hour Advance Booking", desc: "Plan your trip with just a 2-hour notice. We are always ready for your last-minute plans.", icon: "⏱️" },
    { title: "A Cab That Arrives", desc: "Reliable scheduling for your outstation travel. When you book a cab, we are dedicated to on-time arrival.", icon: "🚕" },
    { title: "Free Cancellation", desc: "Change in plans? No worries. Cancel your ride for free up to 2 hours before your scheduled pickup.", icon: "🆓" },
    { title: "Verified Chauffeurs", desc: "Travel with peace of mind. Our drivers are experienced, highly trained, and fully background-checked.", icon: "👨‍✈️" },
    { title: "Clean & Comfortable Cars", desc: "Enjoy a premium ride every time. Our vehicles are strictly maintained, sanitized, and fully air-conditioned.", icon: "✨" },
    { title: "Real-Time Ride Tracking", desc: "Safety first. Track your cab in real-time and share your live location with your loved ones.", icon: "📍" },
    { title: "24×7 Human Support", desc: "No frustrating bots. Talk or chat with our dedicated human support team anytime you need assistance.", icon: "🎧" },
    { title: "Transparent GST Invoices", desc: "Clear and transparent billing with itemized breakdowns. Get compliant invoices for your travel.", icon: "🧾" },
  ];

  return (
    <>
      {/* About Us Section */}
      <section className="py-20 lg:py-28 bg-white" id="about">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 relative rounded-[32px] overflow-hidden shadow-2xl h-[400px] lg:h-[540px] group">
               <Image 
                 src="https://images.pexels.com/photos/4606402/pexels-photo-4606402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=900&dpr=2" 
                 alt="Comfortable intercity cab travel" 
                 fill
                 sizes="(max-width: 1024px) 100vw, 50vw"
                 loading="lazy"
                 className="object-cover transition-transform duration-700 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 to-transparent pointer-events-none" />
               <div className="absolute bottom-8 left-8 text-white pr-8">
                 <div className="text-2xl font-extrabold mb-1">D&G Express Cabs</div>
                 <div className="text-sm opacity-90">Premium outstation travel since 2018</div>
               </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="text-[13px] font-extrabold uppercase tracking-[2px] text-[var(--g)] mb-3">ABOUT D&G EXPRESS CABS</div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-[-1.5px] text-[var(--d)] mb-6">
                Your reliable travel partner.
              </h2>
              <p className="text-[17px] text-[var(--muted)] leading-[1.7] mb-6">
                We believe that the journey should be as memorable as the destination. At D&G Express Cabs, we have built a vast network of premium vehicles and professional chauffeurs dedicated to making your travel seamless, safe, and incredibly comfortable.
              </p>
              <p className="text-[17px] text-[var(--muted)] leading-[1.7] mb-8">
                Whether you're heading for a crucial business meeting, a family weekend getaway, or an airport transfer in the middle of the night, our commitment remains the same: a clean cab, a verified driver, and an on-time arrival, every single time.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[#f7f5eb] px-6 py-4 rounded-2xl border border-[#eef2eb] min-w-[160px]">
                  <div className="text-3xl font-extrabold text-[var(--d)] mb-1">10k+</div>
                  <div className="text-sm font-bold text-[var(--muted)]">Happy Customers</div>
                </div>
                <div className="bg-[#f7f5eb] px-6 py-4 rounded-2xl border border-[#eef2eb] min-w-[160px]">
                  <div className="text-3xl font-extrabold text-[var(--d)] mb-1">99%</div>
                  <div className="text-sm font-bold text-[var(--muted)]">On-Time Arrival</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 lg:py-28 bg-[#f7f5eb] relative overflow-hidden" id="why">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#62c33a]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[13px] font-extrabold uppercase tracking-[2px] text-[var(--g)] mb-3">THE D&G PROMISE</div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-[-1.5px] text-[var(--d)] mb-6">
              Why Choose Us
            </h2>
            <p className="text-[17px] text-[var(--muted)] leading-relaxed">
              We've obsessed over every detail of your journey so you don't have to. Here is our unwavering promise to you when you book a ride.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPoints.map((point, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] border border-[#dce5da] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-[#edf5e7] text-[#123f38] text-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#123f38] group-hover:text-white transition-all duration-300">
                  {point.icon}
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[19px] font-extrabold text-[var(--d)] mb-3 leading-[1.3]">
                  {point.title}
                </h3>
                <p className="text-[15px] text-[var(--muted)] leading-[1.6]">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
