import { Alert, Collapse } from "antd";
import { MacScrollbar } from "mac-scrollbar";
import { Line } from "@ant-design/plots";

const SiteCharts = ({ siteDetails }) => {
  // 处理传入数据为图表
  const dailyData = siteDetails.daily;
  const chartData = [...dailyData].reverse().map((data) => {
    const { uptime, date } = data;
    return {
      time: date.format("YYYY-MM-DD"),
      value: uptime,
    };
  });

  // 图标配置
  const chartConfig = {
    data: chartData,
    padding: "auto",
    xField: "time",
    yField: "value",
    offsetY: 0,
    meta: {
      value: {
        alias: "当日可用率",
        formatter: (v) => `${v}%`,
      },
    },
    xAxis: {
      tickCount: chartData.length,
    },
    smooth: true,
  };

  return (
    <MacScrollbar style={{ maxHeight: "66vh" }}>
      <div className="site-details">
        {siteDetails.status !== "ok" ? (
          siteDetails.average >= 70 ? (
            <Alert
              message="There is an exception on the current site, please check the site status."
              type="warning"
              showIcon
            />
          ) : (
            <Alert
              message="The current site continues to be abnormal, please check the site status immediately or delete it from the monitoring project"
              type="error"
              showIcon
            />
          )
        ) : (
          <Alert
            message="The current site status is normal, please continue to maintain it."
            type="success"
            showIcon
          />
        )}
        <div className="all">
          <Line {...chartConfig} />
          <Collapse
            style={{ marginTop: "20px" }}
            items={[
              {
                key: "all-data",
                label: "Site details initial data",
                children: <p>{JSON.stringify(siteDetails)}</p>,
              },
            ]}
          />
        </div>
      </div>
    </MacScrollbar>
  );
};

export default SiteCharts;
