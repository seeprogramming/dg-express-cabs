import type { ItineraryDay } from "@/types";
import FallbackImage from "@/components/FallbackImage";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/9420512/pexels-photo-9420512.jpeg?auto=compress&cs=tinysrgb&w=1400";

interface PackageItineraryProps {
  itinerary: ItineraryDay[];
  heroImage?: string;
  fallbackImage?: string;
}

export default function PackageItinerary({
  itinerary,
  heroImage = FALLBACK_IMAGE,
  fallbackImage,
}: PackageItineraryProps) {
  return (
    <div className="panel">
      <div
        style={{
          height: "220px",
          borderRadius: "14px",
          marginBottom: "22px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#e5ede8",
        }}
      >
        <FallbackImage
          src={heroImage}
          fallbackSrc={fallbackImage || FALLBACK_IMAGE}
          alt="Complete Itinerary"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
      <div className="ey">DAY BY DAY</div>
      <h2>Complete itinerary</h2>
      <div className="timeline">
        {itinerary.map((d) => (
          <div className="day" key={d.day}>
            <div className="dayTag">DAY {d.day}</div>
            <div>
              <h3>{d.title}</h3>
              {d.activities.map((act, i) => (
                <p key={i}>✓ {act}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
