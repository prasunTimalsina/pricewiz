//"use client";
import Catagory from "@/components/Catagory";
import Featured from "@/components/Featured";
import SearchBar from "@/components/searchbar";
import Seasonal from "@/components/Sesonal";


export default function Page() {

  return (
    <>
      <div className="">
        <SearchBar />
        <Featured />
        <Catagory />
        <Seasonal />
      </div>
    </>
  );
}

