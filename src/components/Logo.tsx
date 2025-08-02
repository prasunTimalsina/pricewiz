import Link from "next/link";
import Image from "next/image";
import logo from "../../public/priceWizLogo.png";

export default function Logo() {
  return (
    <Link href="/" className="inline-block ml-5 z-10">
      <Image
        src={logo}
        alt="PriceWiz Logo"
        width={70}
        height={30}
        priority
      />
    </Link>
  );
}

