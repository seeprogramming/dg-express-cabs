import type { ItineraryDay } from "@/types";

interface PackageItineraryProps {
  itinerary: ItineraryDay[];
  heroImage?: string;
}

export default function PackageItinerary({
  itinerary,
  heroImage = "https://images.pexels.com/photos/9420512/pexels-photo-9420512.jpeg?auto=compress&cs=tinysrgb&w=1400",
}: PackageItineraryProps) {
  return (
    <div className="panel">
      <div
        style={{
          height: "220px",
          borderRadius: "14px",
          marginBottom: "22px",
          background: `url('${heroImage}') center/cover no-repeat`,
        }}
      />
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
