import { DasboradNavBar } from "./_components/nav-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-accent/5 min-h-screen">
      <DasboradNavBar />
      <div className="container py-6">{children}</div>
    </div>
  );
}
