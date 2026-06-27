"use client";

import { OnlineOnlyButton } from "@/components/OnlineOnlyNav";

interface TableroNavTabsProps {
  esFallecidos: boolean;
}

export function TableroNavTabs({ esFallecidos }: TableroNavTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <OnlineOnlyButton
        href="/tablero"
        variant={!esFallecidos ? "default" : "outline"}
        size="sm"
      >
        Con vida
      </OnlineOnlyButton>
      <OnlineOnlyButton
        href="/fallecidos"
        variant={esFallecidos ? "default" : "outline"}
        size="sm"
      >
        Fallecidos
      </OnlineOnlyButton>
    </div>
  );
}
