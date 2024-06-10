import { StateNames } from "data/StateNameToAbbrevsMap";
import React, { useEffect, useState } from "react";
import { CloseLeftSidebarButton } from "./CloseLeftSidebarButton";
import { LeftSidebarBody } from "./LeftSidebarBody";
import LeftSidebarHamburgerIcon from "./LeftSidebarHamburgerIcon";
import { LeftSidebarHeader } from "./LeftSidebarHeader";

interface LeftSidebarProps {
  selectedCountyName: string;
  selectedStateName: StateNames;
  selectedCensusTract: string;
  selectedMetricValue: number | null;
}

interface SummaryInfo {
  [geoid: string]: {
    overall_resilience: number;
    air: number;
    water: number;
    ecosystems: number;
    biodiversity: number;
    infrastructure: number;
    social: number;
    economy: number;
    culture: number;
    carbon: number;
  };
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedCountyName,
  selectedStateName,
  selectedCensusTract,
  selectedMetricValue,
}) => {
  const [openLeftSidebar, setOpenLeftSidebar] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [summaryInfoData, setSummaryInfoData] = useState<SummaryInfo>({});

  useEffect(() => {
    if (!openLeftSidebar) {
      setIsAnimating(true);
    }
  }, [openLeftSidebar]);

  useEffect(() => {
    const fetchSummaryInfoData = async () => {
      try {
        const response = await fetch(
          "https://major-sculpin.nceas.ucsb.edu/api/summary_info",
        );
        const csvText = await response.text();

        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(",");

        const data: SummaryInfo = lines.slice(1).reduce((acc, line) => {
          const values = line.split(",");
          const geoid = values[0];

          const record = headers.reduce(
            (obj, header, index) => {
              if (header !== "geoid") {
                obj[header] = parseFloat(values[index]);
              }
              return obj;
            },
            {} as Record<string, number>,
          );

          acc[geoid] = record as SummaryInfo[string];
          return acc;
        }, {} as SummaryInfo);

        setSummaryInfoData(data);
      } catch (error) {
        console.error("Error fetching summary info data:", error);
      }
    };

    fetchSummaryInfoData();
  }, []);

  const handleTransitionEnd = () => {
    if (!openLeftSidebar) {
      setIsAnimating(false);
    }
  };

  // Attempt to get the overall-resilience score for the selected census tract
  const overallResilienceScoreForCensusTract =
    summaryInfoData[selectedCensusTract]?.overall_resilience || null;

  // Attempt to get the domain scores for the chosen census tract
  const domainScoresForCensusTract = summaryInfoData[selectedCensusTract] || {};

  return (
    <div className="">
      <aside
        id="left-sidebar"
        className={`absolute z-10 h-[calc(100vh-140px)] w-[233px] border-r-[1px] border-solid border-leftSidebarRightBorder bg-white transition-transform duration-300 ease-in-out ${
          openLeftSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <CloseLeftSidebarButton setOpenLeftSidebar={setOpenLeftSidebar} />
        <LeftSidebarHeader
          selectedCountyName={selectedCountyName}
          selectedStateName={selectedStateName}
          selectedCensusTract={selectedCensusTract}
        />
        <LeftSidebarBody
          overallResilienceScore={overallResilienceScoreForCensusTract}
          domainScores={domainScoresForCensusTract}
        />
      </aside>
      {!openLeftSidebar && !isAnimating && (
        <div
          id="hamburger-toggle-for-left-sidebar"
          className="relative flex min-w-10 max-w-10"
        >
          <LeftSidebarHamburgerIcon onClick={() => setOpenLeftSidebar(true)} />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
