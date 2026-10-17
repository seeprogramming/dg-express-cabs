import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.75)",
        marginBottom: "14px",
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        alignItems: "center",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                style={{ opacity: 0.5, margin: "0 2px" }}
              >
                ›
              </span>
            )}
            {isLast || !item.href ? (
              <span
                aria-current="page"
                style={{
                  color: isLast ? "rgba(255,255,255,0.95)" : "inherit",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,255,255,0.3)",
                }}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
