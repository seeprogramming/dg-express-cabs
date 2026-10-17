import Link from 'next/link';

export default function MumbaiOutstationPoster() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[var(--d)] to-[#1a5c52] px-8 py-14 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between">
          
          {/* Decorative background circles */}
          <div className="absolute right-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-[#8bd15a] opacity-10 pointer-events-none" />
          <div className="absolute left-[-50px] bottom-[-50px] h-[200px] w-[200px] rounded-full bg-[var(--g)] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
            <div className="text-[13px] font-extrabold uppercase tracking-[2px] text-[#aee27d] mb-3">
              Quick & Reliable
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-[-1.5px] mb-4">
              Mumbai to Outstation Cabs <br className="hidden md:block"/>
              <span className="text-[#b9e783]">available in 10 minutes.</span>
            </h2>
            <p className="text-[17px] text-[#c8d8d2] leading-relaxed max-w-[540px]">
              Don't let waiting ruin your weekend escape. Our vast network of drivers ensures a premium cab is always nearby, ready to go when you are.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link 
              href="/cabs" 
              className="inline-flex min-h-[52px] items-center justify-center rounded-[12px] bg-[var(--g)] px-7 py-3 text-[15px] font-extrabold text-white transition-all hover:bg-[#56b231] hover:scale-105 whitespace-nowrap shadow-lg shadow-[#62c33a40]"
            >
              Show all available cabs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
