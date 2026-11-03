import { cn } from '@/lib/cn';
import { footerLinks } from '@/lib/layout.shared';

export function SiteFooter({ lang, className }: { lang: string; className?: string }) {
  const zh = lang === 'zh';
  return (
    <footer className={cn('border-t text-sm text-fd-muted-foreground', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between">
        <div className="flex max-w-sm flex-col gap-2">
          <span className="font-semibold text-fd-foreground">CasWAF</span>
          <p>
            {zh
              ? '开源反向代理与Web应用防火墙，Apache-2.0许可证，没有企业版。'
              : 'The open-source reverse proxy and web application firewall. Apache-2.0, with no enterprise edition.'}
          </p>
          <p className="text-xs">Copyright © {new Date().getFullYear()} The Casbin Authors</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
          {footerLinks(lang).map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <span className="font-medium text-fd-foreground">{group.title}</span>
              {group.items.map((item) => (
                <a key={item.url} href={item.url} className="hover:text-fd-foreground">
                  {item.text}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
