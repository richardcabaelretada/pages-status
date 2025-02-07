import { useState } from "react";
import { observer } from "mobx-react-lite";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { formatTimestamp } from "@/utils/timeTools";
import { Refresh } from "@icon-park/react";
import { message } from "antd";
import CountUp from "react-countup";
import useStores from "@/hooks/useStores";

const Header = observer(({ getSiteData }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { status, cache } = useStores();
  const [lastClickTime, setLastClickTime] = useState(0);

  // 加载配置
  const siteName = import.meta.env.VITE_SITE_NAME;

  // 状态文本
  const statusNames = {
    loading: "Sytem status loading",
    error: "Some system are experiencing abnormalities",
    allError: "All system are abnormal",
    normal: "All system are running normally",
    wrong: "Data request failed",
  };

  // 刷新状态
  const refreshStatus = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 60000) {
      messageApi.open({
        key: "update",
        type: "warning",
        content: "Please try refreshing again later",
      });
      return false;
    }
    cache.changeSiteData(null);
    getSiteData();
    setLastClickTime(currentTime);
  };

  return (
    <header id="header" className={status.siteState}>
      {contextHolder}
      <SwitchTransition mode="out-in">
        <CSSTransition key={status.siteState} classNames="fade" timeout={300}>
          <div className={`cover ${status.siteState}`} />
        </CSSTransition>
      </SwitchTransition>
      <div className="container">
        <div className="menu">
          <span className="logo">{siteName}</span>
        </div>
        <div className="status">
          <div className={`icon ${status.siteState}`} />
          <div className="r-text">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={status.siteState}
                classNames="fade"
                timeout={300}
              >
                <div className="text">{statusNames[status.siteState]}</div>
              </CSSTransition>
            </SwitchTransition>
            <div className="tip">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={status.siteState}
                  classNames="fade"
                  timeout={300}
                >
                  {status.siteState === "loading" ? (
                    <span>loading...</span>
                  ) : status.siteState === "wrong" ? (
                    <span>This may be a temporary problem, please refresh and try again</span>
                  ) : (
                    <div className="time">
                      <span className="last-update">
                        {`Last updated on ${
                          formatTimestamp(cache.siteData?.timestamp).justTime
                        }`}
                      </span>
                      <div className="update">
                        <span>Update frequency 5 minutes</span>
                        <Refresh className="refresh" onClick={refreshStatus} />
                      </div>
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={status.siteOverview}
              classNames="fade"
              timeout={300}
            >
              {status.siteOverview ? (
                <div className="overview">
                  <div className="count">
                    <span className="name">Total number of sites</span>
                    <CountUp
                      className="num"
                      end={status.siteOverview.count}
                      duration={1}
                    />
                  </div>
                  <div className="status-num">
                    <div className="ok-count">
                      <span className="name">normal</span>
                      <CountUp
                        className="num"
                        end={status.siteOverview.okCount}
                        duration={1}
                      />
                    </div>
                    <div className="down-count">
                      <span className="name">abnormal</span>
                      <span className="num">
                        <CountUp
                          className="num"
                          end={status.siteOverview.downCount}
                          duration={1}
                        />
                      </span>
                    </div>
                    {status.siteOverview?.unknownCount ? (
                      <div className="unknownCount-count">
                        <span className="name">unknown</span>
                        <span className="num">
                          <CountUp
                            className="num"
                            end={status.siteOverview.unknownCount}
                            duration={1}
                          />
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="overview" />
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </header>
  );
});

export default Header;
