"use client";

import { useEffect, useRef } from 'react';

export default function PageTracker() {
    const ran = useRef(false);
    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'page_view' }),
        });
    }, []);

    return null;
}
