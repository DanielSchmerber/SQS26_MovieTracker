import type { PropsWithChildren } from "react";

export function Background({ children }: PropsWithChildren) {
  return (
    <div
      className="
        relative min-h-screen overflow-hidden
        bg-neutral-50 text-neutral-900
        dark:bg-black dark:text-white

        before:pointer-events-none
        before:absolute
        before:inset-0
        before:opacity-[0.045]
        dark:before:opacity-[0.08]

        before:[background-size:42px_42px]
        before:[background-image:
          linear-gradient(to_right,currentColor_1px,transparent_1px),
          linear-gradient(to_bottom,currentColor_1px,transparent_1px)
        ]

        after:pointer-events-none
        after:absolute
        after:inset-0
        after:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_55%)]

        dark:after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]
      "
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}