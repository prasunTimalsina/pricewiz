import { Button } from "./ui/button";


export default function CatagoryBar() {
  return (
    <>
      <div className=" flex gap-3 w-full justify-center text-white hover:text-black mt-2">
        <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">General</Button>
        <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Tech</Button>
        <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">SecondHand</Button>
        <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Cosmetic</Button>
        <Button className="rounded-2xl bg-black text-white hover:text-black ring-[1px] ring-white h-[20px]">Food</Button>
      </div>
    </>
  );
}
