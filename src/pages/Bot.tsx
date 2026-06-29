const theme = {
  bg: "#131111",
  fg: "#f0ece6",
  muted: "#8a8582",
  accent: "#5a9e9f",
  card: "rgba(25, 23, 22, 0.9)",
};

const sections = [
  {
    title: "What Community Island Is",
    body: "Community Island is the weird, social side of AKR001. The main flight world stays curated and polished. Community Island is where experiments, feature ideas, jokes, and player-driven additions can live without breaking the core route.",
  },
  {
    title: "What You Find There",
    body: "A request board, a feature vote terminal, a hall of contributors, a community cookie fund, message bottles, and a small museum of approved ideas. It is meant to feel playful, slightly chaotic, and alive.",
  },
  {
    title: "Why It Exists",
    body: "It gives the project a place for open-source community energy. People can suggest features, vote on monthly ideas, and help shape future additions while the maintainer still decides what actually ships.",
  },
  {
    title: "How It Fits The Game",
    body: "When you fly there, it should feel like arriving at a strange little island airport where community requests became part of the world. It connects the portfolio, the game, and the open-source project into one place.",
  },
];

export default function BotPage() {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{
        background: "radial-gradient(circle at top, rgba(90,158,159,0.2), transparent 38%), linear-gradient(180deg, #131111 0%, #171312 100%)",
        color: theme.fg,
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="rounded-[28px] border px-8 py-10" style={{ background: theme.card, borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="mb-3 text-sm uppercase tracking-[0.24em]" style={{ color: theme.accent }}>
            AKR001 / Community Island
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">What's in the community island?</h1>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: theme.muted }}>
            This page explains the Community Island part of AKR001: what it is, what lives there, and why it matters to the flight portfolio world.
          </p>
        </div>

        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[24px] border px-7 py-6"
            style={{ background: theme.card, borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: theme.muted }}>
              {section.body}
            </p>
          </section>
        ))}

        <div className="rounded-[24px] border px-7 py-6" style={{ background: theme.card, borderColor: "rgba(255,255,255,0.08)" }}>
          <h2 className="text-2xl font-semibold">Community Island at a glance</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 md:text-base" style={{ color: theme.muted }}>
            <li>Request Board: community ideas and strange suggestions</li>
            <li>Feature Vote Terminal: monthly voting for small new features</li>
            <li>Hall of Contributors: people who helped shape the project</li>
            <li>Community Cookie Fund: playful shared progress using mock data</li>
            <li>Approved Feature Museum: ideas that made it into the world</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
