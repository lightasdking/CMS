
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const renderSidebar = () => (
    <section className="p-4 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 justify-center lg:justify-start"
      >
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <span className="hidden lg:inline font-bold">SchooLama</span>
      </Link>
      <Menu />
    </section>
  );

  const renderMain = () => (
    <section className="flex-1 bg-[#F7F8FA] flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </section>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {renderSidebar()}
      {renderMain()}
    </div>
  );
}