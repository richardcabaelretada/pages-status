import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { formatNumber, formatDuration } from "@/utils/timeTools";
import { LinkTwo } from "@icon-park/react";
import { Tooltip, Button, Result, Modal } from "antd";
import CustomLink from "@/components/customLink";
import SiteCharts from "@/components/siteCharts";

const SiteStatus = ({ siteData, days, status }) => {
  // 弹窗数据
  const [siteDetailsShow, setSiteDetailsShow] = useState(false);
  const [siteDetailsData, setSiteDetailsData] = useState(null);

  // 是否显示链接
  const isShowLinks = import.meta.env.VITE_SHOW_LINKS === "true";

  // 开启弹窗
  const showSiteDetails = (data) => {
    setSiteDetailsShow(true);
    setSiteDetailsData(data);
  };

  // 关闭弹窗
  const closeSiteDetails = () => {
    setSiteDetailsShow(false);
    setSiteDetailsData(null);
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={status.siteState} classNames="fade" timeout={100}>
        {status.siteState !== "wrong" ? (
          status.siteState !== "loading" && siteData ? (
            <div className="sites">
              {siteData.map((site) => (
                <div
                  key={site.id}
                  className={`site ${
                    site.status !== "ok" ? "error" : "normal"
                  }`}
                >
                  <div className="meta">
                    <div className="name">{site.name}</div>
                    {isShowLinks ? (
                      <CustomLink iconDom={<LinkTwo />} to={site.url} />
                    ) : null}
                    <div
                      className={`status ${
                        site.status === "ok"
                          ? "normal"
                          : site.status === "unknown"
                          ? "unknown"
                          : "error"
                      }`}
                    >
                      <div className="icon" />
                      <span className="tip">
                        {site.status === "ok"
                          ? "normal access"
                          : site.status === "unknown"
                          ? "Status unknown"
                          : "Inaccessible"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="timeline"
                    onClick={() => {
                      showSiteDetails(site);
                    }}
                  >
                    {site.daily.map((data, index) => {
                      const { uptime, down, date } = data;
                      const time = date.format("YYYY-MM-DD");
                      let status = null;
                      let tooltipText = null;
                      if (uptime >= 100) {
                        status = "normal";
                        tooltipText = `availability ${formatNumber(uptime)}%`;
                      } else if (uptime <= 0 && down.times === 0) {
                        status = "none";
                        tooltipText = "no data";
                      } else {
                        status = "error";
                        tooltipText = `Fault ${
                          down.times
                        } times, cumulative ${formatDuration(
                          down.duration
                        )}，availability ${formatNumber(uptime)}%`;
                      }
                      return (
                        <Tooltip
                          key={index}
                          // trigger={["hover", "click"]}
                          title={
                            <div className="status-tooltip">
                              <div className="time">{time}</div>
                              <div className="text">{tooltipText}</div>
                            </div>
                          }
                          destroyTooltipOnHide
                        >
                          <div className={`line ${status}`} />
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="summary">
                    <div className="now">Today</div>
                    <div className="note">
                      {site.total.times
                        ? `recently ${days} Failure within days ${
                            site.total.times
                          } times, cumulative ${formatDuration(
                            site.total.duration
                          )}，average availability ${site.average}%`
                        : `Availability rate ${site.average}% in the last ${days} days`}
                    </div>
                    <div className="day">
                      {site.daily[site.daily.length - 1].date.format(
                        "YYYY-MM-DD"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* 站点详情 */}
              <Modal
                title={siteDetailsData?.name}
                open={siteDetailsShow}
                footer={null}
                onOk={closeSiteDetails}
                onCancel={closeSiteDetails}
                bodyStyle={{ marginTop: "20px" }}
              >
                <SiteCharts siteDetails={siteDetailsData} />
              </Modal>
            </div>
          ) : (
            <div className="loading" />
          )
        ) : (
          <Result
            status="error"
            title="The call exceeds the limit or the request is wrong. Please refresh and try again."
            extra={
              <Button
                type="primary"
                danger
                onClick={() => {
                  location.reload();
                }}
              >
                Retry
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default SiteStatus;
