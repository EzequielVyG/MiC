import React, { ReactNode } from 'react';
import Navbar from '@/components/NavBar/NavBar';

interface StaticLayoutProps {
    children: ReactNode;
}

const StaticLayout: React.FC<StaticLayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            <main
                style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    margin: "5vw",
                }}
            >
                {children}
            </main>

            {/* Pie de página común */}
        </div>
    );
};

export default StaticLayout;
