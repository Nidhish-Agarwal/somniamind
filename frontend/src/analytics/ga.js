import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
};

export const trackPage = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (eventName, params = {}) => {
  ReactGA.gtag("event", eventName, params);
};

export const setGA = (data) => {
  ReactGA.set(data);
};
