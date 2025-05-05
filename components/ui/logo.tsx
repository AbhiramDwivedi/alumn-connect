import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "default" | "icon" | "full"
  size?: "sm" | "md" | "lg"
  href?: string
}

export function Logo({ variant = "default", size = "md", href = "/" }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40, iconWidth: 30, iconHeight: 30 },
    md: { width: 150, height: 50, iconWidth: 40, iconHeight: 40 },
    lg: { width: 180, height: 60, iconWidth: 50, iconHeight: 50 },
  }

  const logoContent = (
    <div className="flex items-center gap-2">
      {variant === "icon" && (
        <div className="relative">
          <Image
            src="/images/logo.png"
            alt="MNIT AlumConnect Logo"
            width={sizes[size].iconWidth}
            height={sizes[size].iconHeight}
            className="object-contain"
          />
        </div>
      )}

      {variant === "default" && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="MNIT AlumConnect Logo"
              width={sizes[size].iconWidth}
              height={sizes[size].iconHeight}
              className="object-contain"
            />
          </div>
          <span className={`font-bold ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base"}`}>
            <span className="text-mnit-primary">Alum</span>
            <span className="text-mnit-secondary">Connect</span>
          </span>
        </div>
      )}

      {variant === "full" && (
        <div className="relative">
          <Image
            src="/images/logo.png"
            alt="MNIT AlumConnect Logo"
            width={sizes[size].width}
            height={sizes[size].height}
            className="object-contain"
          />
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{logoContent}</Link>
  }

  return logoContent
}
