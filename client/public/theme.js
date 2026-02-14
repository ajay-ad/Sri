tailwind.config= {

    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                    secondary: 'var(--secondary)',
                    bg: 'var(--bg)',
                    text: 'var(--text)',
                    glass: 'var(--glass)',
                    glassBorder: 'var(--glass-border)',
            }

            ,
            fontFamily: {
                heading: ['var(--heading-font)', 'serif'],
                    body: ['var(--body-font)', 'sans-serif'],
                    shloka: ['var(--shloka-font)', 'serif'],
            }

            ,
            screens: {
                'xs': '480px',
                    'sm': '640px',
                    'md': '768px',
                    'lg': '1024px',
                    'xl': '1280px',
                    '2xl': '1536px',
            }

            ,
            animation: {
                'float': 'float 6s ease-in-out infinite',
                    'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }

            ,
            keyframes: {
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    }

                    ,
                    '50%': {
                        transform: 'translateY(-10px)'
                    }

                    ,
                }
            }
        }
    }
}