import React, { useEffect, useState } from "react";
import StatsModal from "./StatsModal";

// This wrapper component adapts the API response format to what StatsModal expects
const StatsHandler = ({ isOpen, onClose, server, rawStats, isLoading }) => {
  const [processedStats, setProcessedStats] = useState(null);

  useEffect(() => {
    // Only process stats when they're available and not loading
    if (rawStats && !isLoading) {
      const adaptStats = () => {
        console.log("Processing stats in StatsHandler:", rawStats);

        // Extract data from the API response
        const { data } = rawStats;

        if (!data) {
          console.error("No data found in stats response");
          return null;
        }

        // Generate time labels for the last 24 hours
        const timeLabels = generateTimeLabels(data.period || "24h", 12);

        // Generate synthetic data for charts based on the summary metrics
        const responseTimeData = generateDummyResponseTimeData(
          data.avgResponseTime,
          data.minResponseTime,
          data.maxResponseTime,
          timeLabels.length
        );

        // Generate synthetic uptime data
        const uptimeData = generateDummyUptimeData(
          data.uptime,
          timeLabels.length
        );

        // Create the processed stats object in the format StatsModal expects
        const processed = {
          // Chart data
          labels: timeLabels,
          datasets: {
            responseTime: responseTimeData,
            uptime: uptimeData,
            status: uptimeData.map((val) => (val > 95 ? 1 : 0)),
          },

          // Summary metrics
          summary: {
            uptime: data.uptime,
            avgResponseTime: data.avgResponseTime,
            minResponseTime: data.minResponseTime,
            maxResponseTime: data.maxResponseTime,
            totalChecks: data.totalChecks,
            downtime: 100 - data.uptime,
            lastChecked: data.lastChecked,
            responseTimeTrend: data.responseTimeTrend,
          },
        };

        console.log("Processed stats for StatsModal:", processed);
        return processed;
      };

      setProcessedStats(adaptStats());
    } else {
      setProcessedStats(null);
    }
  }, [rawStats, isLoading]);

  // Helper function to generate time labels for charts
  const generateTimeLabels = (period, count) => {
    const labels = [];
    const now = new Date();
    let interval;

    switch (period) {
      case "1h":
        interval = 5;
        break; // 5 minute intervals
      case "12h":
        interval = 60;
        break; // 1 hour intervals
      case "7d":
        interval = 24 * 60;
        break; // 1 day intervals
      case "30d":
        interval = 24 * 60 * 5;
        break; // 5 day intervals
      default:
        interval = 120; // 2 hour intervals for 24h period
    }

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now - i * interval * 60 * 1000);
      labels.push(date.toISOString().slice(0, 16).replace("T", " "));
    }

    return labels;
  };

  // Helper function to generate dummy response time data
  const generateDummyResponseTimeData = (avg, min, max, count) => {
    if (!avg || !min || !max) return Array(count).fill(0);

    const data = [];
    const range = max - min;

    for (let i = 0; i < count; i++) {
      // Generate values that average around the avg response time
      const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
      let value = avg * randomFactor;

      // Ensure values stay within min-max bounds
      value = Math.max(min, Math.min(max, value));
      data.push(Math.round(value));
    }

    return data;
  };

  // Helper function to generate dummy uptime data
  const generateDummyUptimeData = (uptime, count) => {
    if (uptime === undefined) return Array(count).fill(0);

    const data = [];
    const downProbability = (100 - uptime) / 100;

    for (let i = 0; i < count; i++) {
      if (Math.random() < downProbability * 3) {
        // Occasional dip
        data.push(85 + Math.random() * 10);
      } else {
        // Normal uptime
        data.push(100);
      }
    }

    return data;
  };

  return (
    <StatsModal
      isOpen={isOpen}
      onClose={onClose}
      server={server}
      stats={processedStats}
      isLoading={isLoading}
    />
  );
};

export default StatsHandler;
