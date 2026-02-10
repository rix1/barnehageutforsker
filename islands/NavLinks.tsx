interface Props {
  currentPath: string;
}

const tabs = [
  { href: "/", label: "Utforsk" },
  { href: "/table", label: "Tabell" },
];

export default function NavLinks({ currentPath }: Props) {
  const navigate = (e: Event, href: string) => {
    e.preventDefault();
    window.location.href = href + window.location.search;
  };

  return (
    <div class="flex gap-1">
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          onClick={(e) => navigate(e, tab.href)}
          class={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            currentPath === tab.href
              ? "bg-oslo-yellow text-oslo-navy"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
