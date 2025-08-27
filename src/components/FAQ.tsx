import { folksFinanceLink, githubLink, retiLink, tinymanLink, valarLink } from "@/constants/external-links";
import { scrollToSection } from "@/utils/utils";
import { useState } from "react";

import LinkExt from "./LinkExt";

const link = (text: string, href: string) => {
  return <LinkExt href={href} children={text} className={"text-primary-600"} />;
};

const toSection = (section: string) => {
  return (
    <a onClick={() => scrollToSection(section)} className="cursor-pointer text-primary-600">
      {section.charAt(0).toUpperCase() + section.slice(1)}
    </a>
  );
};

const WhyDecentralizationIsImportant = () => {
  const reasons = [
    {
      title: "Increased Resilience",
      description:
        "Decentralized systems have no single point of failure. If one part fails, others continue to operate, making the system more robust.",
    },
    {
      title: "Enhanced Security",
      description: "With no central point to target, decentralized systems are harder to hack or manipulate.",
    },
    {
      title: "Reduced Censorship and Coercion",
      description: "It is harder for a single entity to censor or control a decentralized system.",
    },
    {
      title: "Autonomy and Liberty",
      description:
        "Decentralization gives individuals more control over decisions, voicing their opinions, and supporting their liberties.",
    },
    {
      title: "Innovation and Competition",
      description: "Decentralized systems remove gatekeepers, which fosters innovation and healthy competition.",
    },
    {
      title: "Improved Transparency and Trust",
      description:
        "Blockchains, as decentralization systems, are open protocols, allowing participants to verify information independently.",
    },
  ];

  return (
    <ul className="space-y-4">
      {reasons.map((reason, index) => (
        <li key={index}>
          <span className="font-bold">{reason.title}</span>
          <p>{reason.description}</p>
        </li>
      ))}
    </ul>
  );
};

const faqs = [
  {
    question: "Why is decentralization important?",
    answer: <div>{WhyDecentralizationIsImportant()}</div>,
  },
  {
    question: "Why should I care about decentralization?",
    answer: (
      <span>
        Decentralization helps protect your assets and personal rights, reducing your dependence on systems that can
        fail you.
      </span>
    ),
  },
  {
    question: "How can I contribute to decentralization?",
    answer: (
      <div className="flex flex-col space-y-4">
        <span>
          If you have a computer that is operating 24/7/365 and you are comfortable working with computers, consider
          running a node yourself (i.e. using the native staking solution). This contributes the most to network
          decentralization and has the biggest benefits.
        </span>
        <span>
          If running a node is not for you, consider using one or multiple{" "}
          {link("staking solutions", "https://algorand.co/staking-rewards")}, in particular the ones where you can
          choose the node operator - like {link("Valar", valarLink)} or {link("Reti", retiLink)}. Choosing staking
          solutions and/or operators that have smaller amounts of ALGO and/or users is more beneficial for
          decentralization. Try to also find out the location of the node operators, and thus contribute to network's
          geographical decentralization.
        </span>
      </div>
    ),
  },
  {
    question: "What if I don't want to bother with staking?",
    answer: (
      <span>
        If you are not staking, you are effectively saying that{" "}
        <span className="font-bold"> you trust everyone else with the security of your assets</span> and that you do not
        have any problem with any kind of decisions they make on your behalf. If this is not the case, consider staking
        with one of the available {link("staking solutions", "https://algorand.co/staking-rewards")}.
      </span>
    ),
  },
  {
    question: "What should I consider when selecting a staking solution or a node operator?",
    answer: (
      <div className="flex flex-col space-y-4">
        <span>
          There are multiple aspects to consider - from technical complexities to{" "}
          {link("risks", "https://valar-staking.medium.com/blockchain-risks-with-not-staking-1f7415e2dfb8")} risks and
          benefits.
        </span>
        <div className="flex flex-col">
          <span className="font-bold">Operate Node Yourself</span>
          <span>
            If you have a computer that is operating 24/7/365 and you are comfortable working with computers, consider
            running a node yourself (i.e. using the native staking solution). This minimizes third-party risks, your
            ALGO stays in your wallet, secure and completely liquid at all times. You can also use the node to access
            the blockchain without going through third-parties. Running your own node contributes the most to network
            decentralization but requires the most effort, which includes periodically telling the network that you are
            staking (e.g. every 3 months). You can also earn staking rewards if you stake more than 30k ALGO. The
            rewards are deposited in real-time directly to your account. If this does not sound attractive to you,
            consider using one of the many available {link("staking solutions", "https://algorand.co/staking-rewards")}{" "}
            on Algorand.
          </span>
        </div>

        <span>
          Different staking solutions have different benefits but also carry different risks - from the ability to
          select a node runner that operates your stake on your behalf or not, to using smart contracts for holding your
          ALGO that is staked, to using other third-party software for managing the staking.
        </span>
        <div className="flex flex-col">
          <span className="font-bold">Valar</span>
          <span>
            Staking via {link("Valar", valarLink)} is the closest to native staking. Instead of running a node yourself,
            you pay someone for this service, minimizing your needed effort. You get the same benefits as if you were to
            run a node yourself - but it also has the same limitations. In order to get staking rewards, you need at
            least 30k ALGO and have to periodically renew the staking (e.g. every 3 months). When staking via Valar, you
            can freely choose the node operator that you trust with staking, and thus positively impact Algorand
            decentralization.
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Choosing Node Operator</span>
          <span>
            When choosing a node operator, you are entrusting them to vote in consensus on your behalf. Therefore, it is
            good to consider whether they are publicly doxxed, e.g. as an individual or a company, where they are
            located, how involved they are within the ecosystem and why, etc. It is also important to consider how much
            the node runner is contributing to the (de)centralization of the network.
          </span>
          <span>
            If the operator already has a large amount of ALGO, e.g. more than 5% of total online stake, it is better to
            select a different one. You can check how much ALGO they are operating in the {toSection("overview")} or{" "}
            {toSection("operator")} list. Also consider what staking solution they use. If a large amount of ALGO is
            already staked using this staking solution, it is better to select a different operator.
          </span>
          <span>
            It is also important to consider the operator's node performance as a poorly operated node is harming the
            network and thus can get suspended from participation. Solutions like Valar and Reti give an indication of
            the operator's recent performance.
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Reti</span>
          <span>
            Staking via {link("Reti", retiLink)} similarly allows you to choose a node operator, and thus have a
            positive impact on Algorand decentralization. The difference from Valar is that your ALGO is transferred to
            a smart contract. This overcomes the limitations of native staking, i.e. you can stake any amount of ALGO as
            it is combined with ALGO from other stakers. There is also no need for periodic renewals. The payment for
            the service is a percentage of your rewards. When you want to access your ALGO, you can withdraw it from the
            smart contract, at which time you can also receive your staking rewards.
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Liquid Staking Tokens</span>
          <span>
            If you would like to stake and simultaneously participate in decentralized finance applications, e.g.
            lending, you can use a liquid staking token, e.g. from {link("Tinyman", tinymanLink)} or{" "}
            {link("Folks Finance", folksFinanceLink)}. They work similarly to Reti, where your ALGO is transferred to a
            smart contract. The difference is that you get a so-called liquid staking token in return as proof of
            deposit. You can freely use that token or exchange it back to ALGO at any time. The payment for the service
            is a percentage of your rewards. With liquid staking solutions you typically cannot choose the node operator
            that will operate your stake, and thus are among the most centralizing options. If you would like to use
            such a solution, consider one that does not hold too much ALGO.
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Centralized Exchanges</span>
          <span>
            If you are holding your ALGO on a centralized exchange, e.g.{" "}
            {link("Gate", "https://www.gate.com/staking/ALGO")} or {link("BitPanda", "https://www.bitpanda.com/")}, you
            can also stake your ALGO from there. You do not have a choice of the node operator. These solutions tend to
            centralize the network the most. As seen from the {toSection("overview")}, many exchanges use third-party
            node operators and staking solutions, compounding risks and taking additional cuts in staking rewards.
            Consider taking full ownership of your funds by creating your own wallet like{" "}
            {link("Pera", "https://perawallet.app/")} and staking with any of the other solutions.
          </span>
        </div>
      </div>
    ),
  },
  {
    question: "Can I run a node myself?",
    answer: (
      <span>
        Yes! Algorand node requirements are low. An Algorand node can be run on majority of home computers. To get
        started, check out the{" "}
        {link("guide from Algorand Foundation", "https://dev.algorand.co/nodes/nodekit-quick-start/")} or use community
        developed tools that simplify node operation, like {link("FUNC", "https://github.com/GalaxyPay/func#readme")}.
        When you set up your node, you can also rent its unused capacity to others via{" "}
        {link("Valar", "https://stake.valar.solutions/learn-node")}.
      </span>
    ),
  },
  {
    question: "How can I trust this analysis?",
    answer: (
      <div className="flex flex-col space-y-4">
        <span>
          The source code for this analysis is {link("open-source", githubLink)}! You can check yourself how data is
          gathered and evaluated. Contributions that expand on the quality of the analysis are welcome!
        </span>
        <span>
          The majority of data is fetched directly from blockchain, i.e. there is no backend system you would need to
          trust (because of this the loading takes a while). Some third-party APIs from{" "}
          {link("Nodely", "https://nodely.io/")}, which is also kindly providing API access to the blockchain, are used
          to speed up the loading.
        </span>
      </div>
    ),
  },
];

function FAQItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: { question: string; answer: JSX.Element };
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 transition-all hover:shadow-soft">
      <button onClick={onClick} className="w-full p-6 text-left" aria-expanded={isOpen}>
        <h3 className="mb-1 text-lg font-semibold text-neutral-900">{faq.question}</h3>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <p className="leading-relaxed text-neutral-700">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative">
      <div className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          <p className="text-neutral-600">Common questions about decentralization</p>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
