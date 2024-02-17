import React from "react";
import { GithubOne, Home, Mail } from "@icon-park/react";
import CustomLink from "@/components/customLink";
import Package from "../../package.json";

const Footer = () => {
  // 加载配置
  const githubName = import.meta.env.VITE_GITHUB_NAME;
  const homeUrl = import.meta.env.VITE_HOME_URL;
  const emailUrl = import.meta.env.VITE_EMAIL_URL;
  const siteIcp = import.meta.env.VITE_SITE_ICP;
  const siteBeian = import.meta.env.VITE_SITE_BEIAN;
  const siteBeianUrl = import.meta.env.VITE_SITE_BEIAN_URL;

  return (
    <footer id="footer">
      <div className="social">
        <CustomLink
          iconDom={<GithubOne />}
          to={`https://github.com/${githubName}/`}
        />
        <CustomLink iconDom={<Home />} to={homeUrl} />
        <CustomLink iconDom={<Mail />} to={`mailto:${emailUrl}`} />
      </div>
      <div className="text">
        {/* <p>
          <CustomLink
            text={Package.alia}
            to="https://github.com/zyxmorgan"
          />
          &nbsp;Version&nbsp;{Package.version}
        </p> */}
        <p>
          Based&nbsp;
          <CustomLink to="https://statpages.info/" text="StatsPage" />
          &nbsp;Interface&nbsp;|&nbsp;Detection frequency 5 minutes
        </p>
        <p>
          Copyright&nbsp;&copy;&nbsp;2023&nbsp;-&nbsp;{new Date().getFullYear()}
          &nbsp;
          {/* <CustomLink to="https://www.imsyy.top/" text="無名" /> */}
          {siteIcp ? (
            <React.Fragment>
              &nbsp;|&nbsp;
              <CustomLink to="https://github.com/zyxmorgan" text={siteIcp} />
            </React.Fragment>
          ) : null}
          &nbsp;|&nbsp;
          <img src="https://scalebranding.com/wp-content/uploads/2022/02/583.jpg" height="18"></img>
          {siteBeian ? (
            <React.Fragment>
              <CustomLink to={siteBeianUrl} text={siteBeian} />
            </React.Fragment>
          ) : null}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
