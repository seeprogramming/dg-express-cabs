export default function InclusionExclusion() {
  return (
    <div className="ieGrid">
      <div className="ie">
        <h3>✓ Inclusions</h3>
        <p>✓ Private AC cab</p>
        <p>✓ Driver allowance</p>
        <p>✓ Pickup and drop for selected route</p>
        <p>✓ Standard luggage allowance</p>
      </div>
      <div className="ie">
        <h3>Not included</h3>
        <p>× Parking, tolls and entry fees unless quoted</p>
        <p>× Extra sightseeing / route deviations</p>
        <p>× Driver night allowance if applicable</p>
        <p>× Meals and personal expenses</p>
      </div>
    </div>
  );
}
