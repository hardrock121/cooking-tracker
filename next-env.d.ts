/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module "next/navigation" {
  export interface LinkProps {
    href: string
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
    className?: string
    style?: React.CSSProperties
    prefetch?: boolean
    shallow?: boolean
    scroll?: boolean
  }
  export const Link: React.FC<LinkProps>
}
