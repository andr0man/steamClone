export const SvgComponentMainPanel = ({ rotate }) => {
    return (
        <svg
            width="100%"
            viewBox="0 0 367 67"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'block',
                margin: 0,
                padding: 0,
                position: 'relative',
                transform: rotate ? 'rotate(180deg)' : 'none',
            }}
        >
            <path
                d="M366 41L366 6.00001C366 3.23858 363.761 1.00001 361 1.00001L5.99997 1C3.23856 1 0.99997 3.23858 0.99997 6L0.99997 60C0.99997 62.7614 3.23856 65 5.99997 65L46.7243 65C47.5695 65 48.4008 64.7857 49.1408 64.3773L90.3587 41.6227C91.0986 41.2142 91.93 41 92.7752 41L269.893 41C270.734 41 271.562 41.2123 272.299 41.6172L315.582 65.3828C316.32 65.7877 317.147 66 317.989 66L361 66C363.761 66 366 63.7614 366 61L366 41Z"
                stroke="url(#paint0_linear_2357_551)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_2357_551"
                    x1="-34.4105"
                    y1="42.1832"
                    x2="-5.8929"
                    y2="-42.6158"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="white" />
                    <stop offset="0.182692" stopColor="#8C8C8C" />
                    <stop offset="0.278846" stopColor="#FF9584" />
                    <stop offset="0.399038" stopColor="#DFED43" />
                    <stop offset="0.495192" stopColor="#A0F885" />
                    <stop offset="0.58953" stopColor="#74BFF7" />
                    <stop offset="0.6706" stopColor="#7C72DB" />
                    <stop offset="0.75167" stopColor="#8681A8" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
};
