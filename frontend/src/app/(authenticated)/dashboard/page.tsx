import Dashboard from "./Dashboard"; // Move your current dashboard JSX into a separate component

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: Props) {

  return <Dashboard />;
}
