import DataBreakdown from "@/components/DataBreakdown/DataBreakdown";
import NetworkOverview from "@/components/NetworkOverview";

function Overview() {
  return (
    <section id="overview">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <NetworkOverview />
        </div>
        <div className="xl:col-span-3">
          <DataBreakdown />
        </div>
      </div>
    </section>
  );
}

export default Overview;
