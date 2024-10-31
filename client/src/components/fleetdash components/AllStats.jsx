import { ResponsiveLine } from "@nivo/line";
import mockdata from "../../data/mockdata";

const AllStats = () => {
  return (
    <>
      <h1 className="text-xl font-bold text-center bg-white">
        {" "}
        Total Driver Scores
      </h1>

      <ResponsiveLine
        data={mockdata}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "rgb(48, 48, 48)",
              },
            },
            legend: {
              text: {
                fill: "rgb(48, 48, 48)",
              },
            },
            ticks: {
              line: {
                stroke: "rgb(48, 48, 48)",
                strokeWidth: 1,
              },
              text: {
                fill: "rgb(48, 48, 48)",
              },
            },
          },
          legends: {
            text: {
              fill: "rgb(48, 48, 48)",
            },
          },
          tooltip: {
            container: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "rgb(48, 48, 48)",
            },
          },
        }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto", // Adjust according to your data
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Score",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={true} // Enable vertical grid lines
        enableGridY={true} // Enable horizontal grid lines
        pointSize={10} // Slightly larger points
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right", // Position legend
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 30,
            itemDirection: "top-to-bottom",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default AllStats;
