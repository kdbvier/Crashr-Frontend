import { Inter, Inconsolata, Open_Sans } from "next/font/google";
import Home from "@/views/home";

const inter = Inter({ subsets: ["latin"] });
const inconsolata = Inconsolata({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });
export default function Page() {
  return <Home />;
}
