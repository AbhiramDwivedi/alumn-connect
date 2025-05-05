import { LandingNavbar } from "@/components/landing-navbar"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingFooter } from "@/components/landing-footer"

export default function Page() {
  return (
    <>
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </>
  )
}
