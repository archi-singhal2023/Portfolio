import Marquee from "react-fast-marquee";
import { MARQUEE_ITEMS } from "../../data/portfolio";

export const MarqueeStrip = () => {
  return (
    <div
      data-testid="marquee-strip"
      className="border-y border-white/10 bg-[#050505] py-6 md:py-8"
    >
      <Marquee speed={45} gradient={false} autoFill>
        {MARQUEE_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="font-heading text-4xl font-black uppercase tracking-tight text-stroke md:text-6xl">
              {item}
            </span>
            <span className="mx-8 text-2xl text-[#00FF94] md:mx-12 md:text-4xl">✦</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};
