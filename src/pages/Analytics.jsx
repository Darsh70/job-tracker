import React from "react";
import AnalyticsSummaryGrid from "../components/AnalyticsSummaryGrid";
import JobStatusBarChart from "../components/JobStatusBarChart";
import ApplicationsChart from "../components/ApplicationsByDateLineChart";

export default function Analytics() {
  return (
    <div style={{ 
      backgroundColor: "#F7F5F0", 
      minHeight: "100vh", 
      padding: "20px" 
    }}>
      <AnalyticsSummaryGrid />
      <div className="flex space-x-8 items-center justify-center">
        <div className="flex-1 flex items-center justify-center" style={{ paddingBottom: '20px' }}>
          <JobStatusBarChart />
        </div>
        
        <div className="flex-1 flex items-center justify-center" style={{ paddingTop: '50px' }}>
          <ApplicationsChart />
        </div>
      </div>
    </div>
  );
}
