import Logo from "@/components/Logo";
import Queryresult from "@/components/queryresult";
import SearchBar from "@/components/searchbar";

export default function Page() {

  return (
    <div className="p-6">
      <Logo />
      <SearchBar />
      <Queryresult />
    </div>
  );
}

