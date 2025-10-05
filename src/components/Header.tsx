import LogoFull from "@/assets/logo/full-logo.svg?react";
import Logo from "@/assets/logo/logo.svg?react";
import { valarLink } from "@/constants/external-links";
import { useAppStore } from "@/store/appStore";
import { scrollToSection } from "@/utils/utils";
import { useEffect, useState } from "react";

import LinkExt from "./LinkExt";
import { Tooltip } from "./Tooltip";

const Header = () => {
  const stakingStatsQuery = useAppStore((s) => s.stakingStatsQuery);
  const isLoading = !stakingStatsQuery || stakingStatsQuery?.isLoading;
  const isFetching = !stakingStatsQuery || stakingStatsQuery?.isFetching;
  const isError = !isLoading && (stakingStatsQuery?.isError || !stakingStatsQuery.data);
  const hasData = !isLoading && !isError && stakingStatsQuery.data;

  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading snapshot");
  const [showSubHeader, setShowSubHeader] = useState(false);

  const getStatusIndicator = () => {
    if (isLoading) {
      return (
        <Tooltip content={"Loading last snapshot and fetching latest data from blockchain. This can take up to 1 min."}>
          <div className="flex items-center space-x-2 rounded-xl bg-warning-100 px-3 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-warning-400"></div>
            <span className="w-[116px] justify-start text-sm font-medium text-warning-600">{loadingText}</span>
          </div>
        </Tooltip>
      );
    }

    if (isFetching) {
      return (
        <Tooltip content={"Fetching latest data from blockchain. This can take up to 1 min."}>
          <div className="flex items-center space-x-2 rounded-xl bg-warning-100 px-3 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-warning-400"></div>
            <span className="w-[100px] justify-start text-sm font-medium text-warning-600">{loadingText}</span>
          </div>
        </Tooltip>
      );
    }

    if (isError) {
      return (
        <Tooltip
          content={
            "There has been an error fetching data from blockchain. Please contact developers to report the problem."
          }
        >
          <div className="flex items-center space-x-2 rounded-xl bg-error-100 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-error-500"></div>
            <span className="text-sm font-medium text-error-700">{loadingText + " data"}</span>
          </div>
        </Tooltip>
      );
    }
    return null;
  };

  // Handle loading text transition and sub-header visibility
  useEffect(() => {
    if (isLoading) {
      setShowSubHeader(true);
      setLoadingText("Loading snapshot");
    } else if (isFetching) {
      setShowSubHeader(true);
      setLoadingText("Fetching latest");
    } else if (isError) {
      setShowSubHeader(true);
      setLoadingText("Error fetching");
    } else if (hasData) {
      setShowSubHeader(false);
    }
  }, [isLoading, isFetching, isError, hasData]);

  const navigationItems = [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "operators", label: "Operators", href: "#operators" },
    { id: "faq", label: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Determine active section based on scroll position
      const sections = ["home", "overview", "operators", "faq"];
      const sectionElements = sections.map((id) => document.getElementById(id));

      let currentSection = "home";

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = sections[i];
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-neutral-200/80 bg-white/95 shadow-soft backdrop-blur-xl"
            : "border-b border-neutral-200/30 bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div
                  className={`flex items-center justify-center rounded-lg p-2 transition-all duration-300 ${
                    isScrolled ? "scale-95" : "scale-100"
                  }`}
                >
                  <LinkExt href={valarLink}>
                    <Logo className="h-8 text-gray-800 sm:hidden" />
                    <LogoFull className="hidden text-gray-800 sm:block sm:h-8 lg:h-9" />
                  </LinkExt>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">Algorand Decentralization</h1>
                <p className="hidden text-xs text-gray-600 sm:text-sm md:block">Online Stake Analysis</p>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <div className="hidden px-2 md:block">{getStatusIndicator()}</div>
              {/* Navigation */}
              <nav className="flex items-center space-x-0 lg:space-x-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-2 py-2 text-sm font-medium transition-all duration-200 sm:text-base lg:px-4 ${
                      activeSection === item.id ? "text-primary-600" : "text-neutral-700 hover:text-primary-600"
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary-500 transition-all duration-300" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Status Sub-header */}
      <div
        className={`visible sticky top-20 z-40 overflow-hidden border-y shadow-soft transition-all duration-500 ease-in-out md:hidden ${
          showSubHeader ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        } ${isError ? "border-error-200/80 bg-error-100" : "border-warning-200/80 bg-warning-100"}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center border-b border-neutral-200/50">
            <div className={`flex items-center space-x-3 ${isError ? "text-error-600" : "text-warning-600"}`}>
              <div
                className={`h-2 w-2 rounded-full ${
                  isError ? "bg-error-500" : "bg-warning-400"
                } ${isLoading || isFetching ? "animate-pulse" : ""}`}
              ></div>
              <span className={`text-sm font-medium ${isLoading || isFetching ? "animate-pulse" : ""} sm:text-base`}>
                {loadingText + " data"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
