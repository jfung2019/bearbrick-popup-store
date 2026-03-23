// src/components/icons/SocialIcons.tsx

type BaseSVGProps = {
    children: React.ReactNode;
};

const BaseSVG = ({ children }: BaseSVGProps) => (
    <svg
        width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        className="transition-colors duration-200"
    >
        <circle cx="12" cy="12" r="10" />
        {children}
    </svg>
);

export const Instagram = () => (
    <BaseSVG>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
    </BaseSVG>
);

export const Facebook = () => (
    <BaseSVG>
        <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v2h2v6h2v-6h2l.5-2H13v-1a1 1 0 0 1 1-1h1V8z" />
    </BaseSVG>
);

export const Rednote = () => (
    <BaseSVG>
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="12" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M14 7v2c3 0.2 5.5 1.8 6 4 0.2 0.8-0.2 1.5-1 1.5s-1.5-0.5-1.8-1.2C16.8 12 15.5 11 14 11v8c0 1-0.8 1.8-1.8 1.8S10.4 20 10.4 19v-8c-1.5 0-2.8 1-3.2 2.3-0.3 0.7-1 1.2-1.8 1.2s-1.2-0.7-1-1.5c0.5-2.2 3-3.8 6-4V7c0-0.8 0.8-1.5 1.8-1.5S14 6.2 14 7z" fill="#FFFFFF" />
        </svg>
    </BaseSVG>
);

export const Douyin = () => (
    <BaseSVG>
        <path d="M15 7v6a3 3 0 1 1-2-2.83" />
        <path d="M15 10c2 0 3-1 3-3" />
    </BaseSVG>
);

// ... and so on