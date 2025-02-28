import React from 'react';
import Image from "next/image"
import styles from './Splash.module.css';

const Splash = () => {
    return (
        <div className={styles.splashContainer} id="globalLoader">
            <Image
                src="/logo.gif"
                alt="MIC"
                width={200}
                height={100}
                className={styles.pulseAnimation}
            />
        </div>
    );
};

export default Splash;
