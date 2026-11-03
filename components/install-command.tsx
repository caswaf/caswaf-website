'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

const commands = [
  {
    label: 'Source',
    command:
      'git clone https://github.com/caswaf/caswaf && cd caswaf/web && yarn install && yarn build && cd .. && go build -o caswaf . && sudo ./caswaf -createDatabase=true',
  },
  {
    label: 'Docker Compose',
    command: 'git clone https://github.com/caswaf/caswaf && cd caswaf && docker compose up -d --build',
  },
];

export function InstallCommand({ copyLabel }: { copyLabel: string }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const { command } = commands[active];

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border bg-fd-card text-left shadow-sm">
      <div className="flex items-center gap-1 border-b px-2 pt-2">
        {commands.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              '-mb-px rounded-t-md border-b-2 px-3 py-1.5 text-sm transition-colors',
              i === active
                ? 'border-fd-primary font-medium text-fd-foreground'
                : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] font-mono text-[13px] text-fd-foreground">
          <span className="select-none text-fd-muted-foreground">$ </span>
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copyLabel}
          className="shrink-0 rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
