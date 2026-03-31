import Link from "next/link";
import { notFound } from "next/navigation";

import { TaskWorkspace } from "@/components/task-workspace";
import { getPracticeTaskContent } from "@/lib/content-store";
import { practiceTasks } from "@/lib/practice-tasks";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return practiceTasks.map((task) => ({ taskId: task.id }));
}

export default async function PracticeTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = await getPracticeTaskContent(taskId);

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Interaktív gyakorlás</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {task.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
            A feladatlap és a kódszerkesztő egy oldalon van, így a tanuló azonnal kipróbálhatja a megoldást a beépített, szigorított judge-on.
          </p>
        </div>
        <Link className="secondary-link" href="/gyakorlas">
          Vissza a gyakorlóbankhoz
        </Link>
      </section>

      <TaskWorkspace task={task} />
    </main>
  );
}