import packageJson from "@/../package.json";
import discord from "@/assets/socials/discord.svg";
import github from "@/assets/socials/github.svg";
import linkedIn from "@/assets/socials/linkedin.svg";
import telegram from "@/assets/socials/telegram.svg";
import x from "@/assets/socials/twitter.svg";
import {
  discordLink,
  githubLink,
  linkedInLink,
  telegramLink,
  twitterLink,
  valarSolutionsLink,
} from "@/constants/external-links";
import { useState } from "react";

import Disclaimer from "./Disclaimer";
import LinkExt from "./LinkExt";
import { useAppStore } from "@/store/appStore";
import { Skeleton } from "./Loaders/Skeleton";

const socials = [
  {
    icon: github,
    label: "Github",
    link: githubLink,
  },
  {
    icon: x,
    label: "Twitter (X)",
    link: twitterLink,
  },
  {
    icon: discord,
    label: "Discord",
    link: discordLink,
  },
  {
    icon: telegram,
    label: "Telegram",
    link: telegramLink,
  },
  {
    icon: linkedIn,
    label: "LinkedIn",
    link: linkedInLink,
  },
];

const Footer = () => {
  const stakingStatsQuery = useAppStore((s) => s.stakingStatsQuery);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const timestamp = stakingStatsQuery?.data?.timestamp
  const date = !timestamp ? <Skeleton className="h-3 w-[64px]" /> : <>{(new Date(timestamp)).toLocaleDateString()}</>

  return (
    <>
      {/* Footer Content */}
      <footer className="mt-16 w-full border-t border-neutral-200 p-8 px-4 sm:p-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 text-center lg:grid-cols-3 lg:items-center">
            {/* Left-aligned on md+, centered on mobile */}
            <div className="flex flex-row lg:text-left justify-center lg:justify-start">
              <p className="text-sm text-neutral-600 mr-1">App v{packageJson.version}</p>
              <LinkExt href={valarSolutionsLink} className="text-sm text-neutral-600 hover:text-neutral-800">
                &copy; 2025 Valar Solutions GmbH
              </LinkExt>
            </div>

            {/* Centered social icons */}
            <div className="flex justify-center gap-6 lg:gap-x-7">
              {socials.map((item, index) => (
                <LinkExt key={index} href={item.link}>
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-6 transition-all duration-300 sm:h-6 lg:h-7"
                  />
                </LinkExt>
              ))}
            </div>

            {/* Right-aligned on md+, centered on mobile */}
            <div className="lg:text-right w-full">
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 justify-end">
                <div className="flex flex-row gap-2 justify-center items-center text-sm text-neutral-600">
                  Data last updated: {date}
                </div>
                <button
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-800"
                >
                  Disclaimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isDisclaimerOpen && <Disclaimer isDisclaimerOpen={isDisclaimerOpen} setIsDisclaimerOpen={setIsDisclaimerOpen} />}
    </>
  );
};

export default Footer;
