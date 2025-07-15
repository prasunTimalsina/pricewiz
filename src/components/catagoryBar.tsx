import Link from "next/link";
import { Button } from "./ui/button";


export default function CatagoryBar() {
  return (
    <>
      <div className=" flex gap-3 w-full justify-center text-white hover:text-black mt-2">
        <Link href={"/site/general"}>
          <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">General</Button>
        </Link>

        <Link href={"/site/tech"}>
          <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Tech</Button>
        </Link>

        <Link href={"/site/secondhand"}>
          <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Secondhand</Button>
        </Link>

        <Link href={"/site/food"}>
          <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Food</Button>
        </Link>

        <Link href={"/site/cosmetic"}>
          <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Cosmetic</Button>
        </Link>
      </div>
    </>
  );
}
