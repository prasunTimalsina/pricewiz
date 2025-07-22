import Queryresult from "@/components/queryresult";
import SearchBar from "@/components/searchbar";

export default function Page() {

  return (
    <div className="p-6">
      <SearchBar />
      <Queryresult />
    </div>
  );
}

