import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/scenes/scene-001/overview");
}
