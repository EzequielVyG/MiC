// languages.js
import Image from 'next/image';
import React from 'react';
const languages = [
    {
    idioma: "es",
    bandera: <Image src={require('../../public/flags/ar.svg')} alt="Argentine Flag" width={20} height={14} />
    },
    {
    idioma: "en",
    bandera: <Image src={require('../../public/flags/us.svg')} alt="USA Flag" width={20} height={14} />
    }
];
export default languages;

