import { Header } from "@/ui/templates/Layout/Header/Header";
import { FrontPage } from "@/ui/templates/FrontPage";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  return (
    <>
      <Header lang={lang} currentPage="front" />
      <FrontPage />
    </>
  );
}
