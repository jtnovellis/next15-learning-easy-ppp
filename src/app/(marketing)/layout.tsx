import { NavBar } from "./_components/nav-bar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="selection:bg-[hsl(320,65%,53%,20%)]">
      <NavBar />
      {children}
    </div>
  );
}
