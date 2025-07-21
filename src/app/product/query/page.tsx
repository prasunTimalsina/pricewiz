import Queryresult from "@/components/queryresult";

interface PageProps {
  searchParams: { q?: string; };
}

export default function Page({ searchParams }: PageProps) {
  const query = searchParams.q ?? "";

  return (
    <div className="p-6">
      {query ? <Queryresult query={query} /> : <p>Please enter a search term.</p>}
    </div>
  );
}

