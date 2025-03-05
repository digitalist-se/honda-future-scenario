import { Header } from "@/ui/templates/Layout/Header";
import { AboutPage } from "@/ui/templates/AboutPage";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  return (
    <>
      <Header lang={lang} currentPage="about" />
      <AboutPage />
    </>
  );
}
