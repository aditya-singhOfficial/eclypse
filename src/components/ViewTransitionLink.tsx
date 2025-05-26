// src/components/ViewTransitionLink.tsx
import React, { type AnchorHTMLAttributes } from 'react'
import { type LinkProps, Link, useNavigate } from 'react-router-dom'

type VTLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** fallback if View Transitions isn’t supported (defaults to a simple navigate) */
    fallback?: () => void
}

export default function ViewTransitionLink({
    to,
    onClick,
    fallback,
    ...linkProps
}: VTLinkProps) {
    const navigate = useNavigate()

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        // allow any other onClick handlers to fire
        onClick?.(e)
        if (e.defaultPrevented) return

        e.preventDefault()

        const doNavigate = () => {
            // you can pass any options here: replace, state, etc.
            navigate(to, { replace: false })
        }

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                doNavigate()
            })
        } else if (fallback) {
            fallback()
        } else {
            doNavigate()
        }
    }

    // Use a normal <Link> for href semantics, but override onClick
    return <Link to={to} {...linkProps} onClick={handleClick} />
}
