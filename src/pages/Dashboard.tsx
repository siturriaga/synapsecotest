import DayCycleBackground from "../components/DayCycleBackground";
export default function Dashboard() {
  return (
    <>
      <DayCycleBackground />
      <div className="container">
        <div className="grid grid-2">
          <div className="card"><h2>Welcome</h2><p>Your planning hub.</p></div>
          <div className="card"><h2>Assignments</h2><p>Create standards-aligned assessments with AI.</p></div>
        </div>
      </div>
    </>
  );
}
