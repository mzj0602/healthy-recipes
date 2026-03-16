interface SiteFooterProps {
  text: string;
}

export function SiteFooter({ text }: SiteFooterProps) {
  return (
    <footer className="border-t border-[#f2dfcf] px-5 py-5 text-center text-xs text-[#b08d74] sm:px-7">
      {text}
    </footer>
  );
}
