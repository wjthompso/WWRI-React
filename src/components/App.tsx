import { StateNames } from "data/StateNameToAbbrevsMap";
import { useState } from "react";
import SelectedMetricIdObject from "../types/componentStatetypes";
import Header from "./Header/Header";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import MapArea from "./MapArea/MapArea";
import RightSidebar from "./RightSidebar";
import Subheader from "./Subheader/Subheader";

function App() {
  const [selectedMetricIdObject, setSelectedMetricIdObject] =
    useState<SelectedMetricIdObject>({
      domainId: "air_quality_metrics",
      metricId: "status_metric_1",
      label: "Air Pollutants Resistance",
    });
  const [selectedMetricValue, setSelectedMetricValue] = useState<number | null>(
    null,
  );
  const [selectedCountyName, setSelectedCountyName] = useState<string>("");
  const [selectedStateName, setSelectedStateName] = useState<StateNames>("");
  const [selectedCensusTract, setSelectedCensusTract] = useState<string>("");

  return (
    <div className="h-full w-full">
      <Header />
      <div id="body" className="flex flex-1">
        <div
          id="body-minus-right-sidebar"
          className="flex min-w-[580px] flex-1 flex-col"
        >
          <Subheader />
          <LeftSidebar
            selectedCountyName={selectedCountyName}
            selectedStateName={selectedStateName}
            selectedCensusTract={selectedCensusTract}
            selectedMetricValue={selectedMetricValue}
          />
          <MapArea
            selectedMetricIdObject={selectedMetricIdObject}
            selectedCensusTract={selectedCensusTract}
            setSelectedCountyName={setSelectedCountyName}
            setSelectedStateName={setSelectedStateName}
            setSelectedCensusTract={setSelectedCensusTract}
            setSelectedMetricValue={setSelectedMetricValue}
          />
        </div>
        <RightSidebar
          selectedMetricIdObject={selectedMetricIdObject}
          setSelectedMetricIdObject={setSelectedMetricIdObject}
        ></RightSidebar>
      </div>
    </div>
  );
}

export default App;
