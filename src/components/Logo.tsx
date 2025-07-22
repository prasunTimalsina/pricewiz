import Link from "next/link";
import { Button } from "./ui/button";

export default function Logo() {
  return (
    <>
      <Link href="/">
        <Button className="text-white font-bold">PriceWiz</Button>
      </Link>
    </>
  );
}
