import Queryresult from "@/components/queryresult";

interface PageProps {
  searchParams: { q?: string; };
}

export default function Page({ searchParams }: PageProps) {
  const query = searchParams.q ?? "";

  return (
    <div className="p-6">
      <Queryresult query={query} />
    </div>
  );
}

