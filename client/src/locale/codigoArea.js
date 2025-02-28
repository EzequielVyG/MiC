import React from 'react';
import Image from 'next/image';
const codigoArea = [
    {
      abbreviation: 'AF',
      flag: <Image src={require('../../public/flags/af.svg')} alt="" width={20} height={14} />,
      phoneCode: '+93',
    },
    {
      abbreviation: 'AL',
      flag: <Image src={require('../../public/flags/al.svg')} alt="" width={18} height={12} />,
      phoneCode: '+355',
    },
    {
      abbreviation: 'DE',
      flag: <Image src={require('../../public/flags/de.svg')} alt="" width={18} height={12} />,
      phoneCode: '+49',
    },
    {
      abbreviation: 'AD',
      flag: <Image src={require('../../public/flags/ad.svg')} alt="" width={19} height={13} />,
      phoneCode: '+376',
    },
    {
      abbreviation: 'AO',
      flag: <Image src={require('../../public/flags/ao.svg')} alt="" width={18} height={12} />,
      phoneCode: '+244',
    },
    {
      abbreviation: 'AI',
      flag: <Image src={require('../../public/flags/ai.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 264',
    },
    {
      abbreviation: 'AQ',
      flag: <Image src={require('../../public/flags/aq.svg')} alt="" width={18} height={12} />,
      phoneCode: '+672',
    },
    {
      abbreviation: 'AG',
      flag: <Image src={require('../../public/flags/ag.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 268',
    },
    {
      abbreviation: 'SA',
      flag: <Image src={require('../../public/flags/sa.svg')} alt="" width={18} height={12} />,
      phoneCode: '+966',
    },
    {
      abbreviation: 'DZ',
      flag: <Image src={require('../../public/flags/dz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+213',
    },
    {
      abbreviation: 'AR',
      flag: <Image src={require('../../public/flags/ar.svg')} alt="" width={18} height={12} />,
      phoneCode: '+54',
    },
    {
      abbreviation: 'AM',
      flag: <Image src={require('../../public/flags/am.svg')} alt="" width={18} height={12} />,
      phoneCode: '+374',
    },
    {
      abbreviation: 'AW',
      flag: <Image src={require('../../public/flags/aw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+297',
    },
    {
      abbreviation: 'AU',
      flag: <Image src={require('../../public/flags/au.svg')} alt="" width={18} height={12} />,
      phoneCode: '+61',
    },
    {
      abbreviation: 'AT',
      flag: <Image src={require('../../public/flags/at.svg')} alt="" width={18} height={12} />,
      phoneCode: '+43',
    },
    {
      abbreviation: 'AZ',
      flag: <Image src={require('../../public/flags/az.svg')} alt="" width={18} height={12} />,
      phoneCode: '+994',
    },
    {
      abbreviation: 'BS',
      flag: <Image src={require('../../public/flags/bs.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 242',
    },
    {
      abbreviation: 'BH',
      flag: <Image src={require('../../public/flags/bh.svg')} alt="" width={18} height={12} />,
      phoneCode: '+973',
    },
    {
      abbreviation: 'BD',
      flag: <Image src={require('../../public/flags/bd.svg')} alt="" width={18} height={12} />,
      phoneCode: '+880',
    },
    {
      abbreviation: 'BB',
      flag: <Image src={require('../../public/flags/bb.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 246',
    },
    {
      abbreviation: 'BZ',
      flag: <Image src={require('../../public/flags/bz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+501',
    },
    {
      abbreviation: 'BJ',
      flag: <Image src={require('../../public/flags/bj.svg')} alt="" width={18} height={12} />,
      phoneCode: '+229',
    },
    {
      abbreviation: 'BT',
      flag: <Image src={require('../../public/flags/bt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+975',
    },
    {
      abbreviation: 'BY',
      flag: <Image src={require('../../public/flags/by.svg')} alt="" width={18} height={12} />,
      phoneCode: '+375',
    },
    {
      abbreviation: 'MM',
      flag: <Image src={require('../../public/flags/mm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+95',
    },
    {
      abbreviation: 'BO',
      flag: <Image src={require('../../public/flags/bo.svg')} alt="" width={18} height={12} />,
      phoneCode: '+591',
    },
    {
      abbreviation: 'BA',
      flag: <Image src={require('../../public/flags/ba.svg')} alt="" width={18} height={12} />,
      phoneCode: '+387',
    },
    {
      abbreviation: 'BW',
      flag: <Image src={require('../../public/flags/bw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+267',
    },
    {
      abbreviation: 'BR',
      flag: <Image src={require('../../public/flags/br.svg')} alt="" width={18} height={12} />,
      phoneCode: '+55',
    },
    {
      abbreviation: 'BN',
      flag: <Image src={require('../../public/flags/bn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+673',
    },
    {
      abbreviation: 'BG',
      flag: <Image src={require('../../public/flags/bg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+359',
    },
    {
      abbreviation: 'BF',
      flag: <Image src={require('../../public/flags/bf.svg')} alt="" width={18} height={12} />,
      phoneCode: '+226',
    },
    {
      abbreviation: 'BI',
      flag: <Image src={require('../../public/flags/bi.svg')} alt="" width={18} height={12} />,
      phoneCode: '+257',
    },
    {
      abbreviation: 'CV',
      flag: <Image src={require('../../public/flags/cv.svg')} alt="" width={18} height={12} />,
      phoneCode: '+238',
    },
    {
      abbreviation: 'KH',
      flag: <Image src={require('../../public/flags/kh.svg')} alt="" width={18} height={12} />,
      phoneCode: '+855',
    },
    {
      abbreviation: 'CM',
      flag: <Image src={require('../../public/flags/cm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+237',
    },
    {
      abbreviation: 'CA',
      flag: <Image src={require('../../public/flags/ca.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1',
    },
    {
      abbreviation: 'TD',
      flag: <Image src={require('../../public/flags/td.svg')} alt="" width={18} height={12} />,
      phoneCode: '+235',
    },
    {
      abbreviation: 'CL',
      flag: <Image src={require('../../public/flags/cl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+56',
    },
    {
      abbreviation: 'CN',
      flag: <Image src={require('../../public/flags/cn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+86',
    },
    {
      abbreviation: 'CY',
      flag: <Image src={require('../../public/flags/cy.svg')} alt="" width={18} height={12} />,
      phoneCode: '+357',
    },
    {
      abbreviation: 'VA',
      flag: <Image src={require('../../public/flags/va.svg')} alt="" width={18} height={12} />,
      phoneCode: '+39',
    },
    {
      abbreviation: 'CO',
      flag: <Image src={require('../../public/flags/co.svg')} alt="" width={18} height={12} />,
      phoneCode: '+57',
    },
    {
      abbreviation: 'KM',
      flag: <Image src={require('../../public/flags/km.svg')} alt="" width={18} height={12} />,
      phoneCode: '+269',
    },
    {
      abbreviation: 'CG',
      flag: <Image src={require('../../public/flags/cg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+242',
    },
    {
      abbreviation: 'CD',
      flag: <Image src={require('../../public/flags/cd.svg')} alt="" width={18} height={12} />,
      phoneCode: '+243',
    },
    {
      abbreviation: 'KP',
      flag: <Image src={require('../../public/flags/kp.svg')} alt="" width={18} height={12} />,
      phoneCode: '+850',
    },
    {
      abbreviation: 'KR',
      flag: <Image src={require('../../public/flags/kr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+82',
    },
    {
      abbreviation: 'CI',
      flag: <Image src={require('../../public/flags/ci.svg')} alt="" width={18} height={12} />,
      phoneCode: '+225',
    },
    {
      abbreviation: 'CR',
      flag: <Image src={require('../../public/flags/cr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+506',
    },
    {
      abbreviation: 'HR',
      flag: <Image src={require('../../public/flags/hr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+385',
    },
    {
      abbreviation: 'CU',
      flag: <Image src={require('../../public/flags/cu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+53',
    },
    {
      abbreviation: 'CW',
      flag: <Image src={require('../../public/flags/cw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+5999',
    },
    {
      abbreviation: 'DK',
      flag: <Image src={require('../../public/flags/dk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+45',
    },
    {
      abbreviation: 'DM',
      flag: <Image src={require('../../public/flags/dm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 767',
    },
    {
      abbreviation: 'EC',
      flag: <Image src={require('../../public/flags/ec.svg')} alt="" width={18} height={12} />,
      phoneCode: '+593',
    },
    {
      abbreviation: 'EG',
      flag: <Image src={require('../../public/flags/eg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+20',
    },
    {
      abbreviation: 'SV',
      flag: <Image src={require('../../public/flags/sv.svg')} alt="" width={18} height={12} />,
      phoneCode: '+503',
    },
    {
      abbreviation: 'AE',
      flag: <Image src={require('../../public/flags/ae.svg')} alt="" width={18} height={12} />,
      phoneCode: '+971',
    },
    {
      abbreviation: 'ER',
      flag: <Image src={require('../../public/flags/er.svg')} alt="" width={18} height={12} />,
      phoneCode: '+291',
    },
    {
      abbreviation: 'SK',
      flag: <Image src={require('../../public/flags/sk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+421',
    },
    {
      abbreviation: 'SI',
      flag: <Image src={require('../../public/flags/si.svg')} alt="" width={18} height={12} />,
      phoneCode: '+386',
    },
    {
      abbreviation: 'ES',
      flag: <Image src={require('../../public/flags/es.svg')} alt="" width={18} height={12} />,
      phoneCode: '+34',
    },
    {
      abbreviation: 'US',
      flag: <Image src={require('../../public/flags/us.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1',
    },
    {
      abbreviation: 'EE',
      flag: <Image src={require('../../public/flags/ee.svg')} alt="" width={18} height={12} />,
      phoneCode: '+372',
    },
    {
      abbreviation: 'ET',
      flag: <Image src={require('../../public/flags/et.svg')} alt="" width={18} height={12} />,
      phoneCode: '+251',
    },
    {
      abbreviation: 'PH',
      flag: <Image src={require('../../public/flags/ph.svg')} alt="" width={18} height={12} />,
      phoneCode: '+63',
    },
    {
      abbreviation: 'FI',
      flag: <Image src={require('../../public/flags/fi.svg')} alt="" width={18} height={12} />,
      phoneCode: '+358',
    },
    {
      abbreviation: 'FJ',
      flag: <Image src={require('../../public/flags/fj.svg')} alt="" width={18} height={12} />,
      phoneCode: '+679',
    },
    {
      abbreviation: 'FR',
      flag: <Image src={require('../../public/flags/fr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+33',
    },
    {
      abbreviation: 'GA',
      flag: <Image src={require('../../public/flags/ga.svg')} alt="" width={18} height={12} />,
      phoneCode: '+241',
    },
    {
      abbreviation: 'GM',
      flag: <Image src={require('../../public/flags/gm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+220',
    },
    {
      abbreviation: 'GE',
      flag: <Image src={require('../../public/flags/ge.svg')} alt="" width={18} height={12} />,
      phoneCode: '+995',
    },
    {
      abbreviation: 'GH',
      flag: <Image src={require('../../public/flags/gh.svg')} alt="" width={18} height={12} />,
      phoneCode: '+233',
    },
    {
      abbreviation: 'GI',
      flag: <Image src={require('../../public/flags/gi.svg')} alt="" width={18} height={12} />,
      phoneCode: '+350',
    },
    {
      abbreviation: 'GD',
      flag: <Image src={require('../../public/flags/gd.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 473',
    },
    {
      abbreviation: 'GR',
      flag: <Image src={require('../../public/flags/gr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+30',
    },
    {
      abbreviation: 'GL',
      flag: <Image src={require('../../public/flags/gl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+299',
    },
    {
      abbreviation: 'GP',
      flag: <Image src={require('../../public/flags/gp.svg')} alt="" width={18} height={12} />,
      phoneCode: '+590',
    },
    {
      abbreviation: 'GU',
      flag: <Image src={require('../../public/flags/gu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 671',
    },
    {
      abbreviation: 'GT',
      flag: <Image src={require('../../public/flags/gt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+502',
    },
    {
      abbreviation: 'GG',
      flag: <Image src={require('../../public/flags/gg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+44',
    },
    {
      abbreviation: 'GN',
      flag: <Image src={require('../../public/flags/gn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+224',
    },
    {
      abbreviation: 'GQ',
      flag: <Image src={require('../../public/flags/gq.svg')} alt="" width={18} height={12} />,
      phoneCode: '+240',
    },
    {
      abbreviation: 'GW',
      flag: <Image src={require('../../public/flags/gw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+245',
    },
    {
      abbreviation: 'GY',
      flag: <Image src={require('../../public/flags/gy.svg')} alt="" width={18} height={12} />,
      phoneCode: '+592',
    },
    {
      abbreviation: 'HT',
      flag: <Image src={require('../../public/flags/ht.svg')} alt="" width={18} height={12} />,
      phoneCode: '+509',
    },
    {
      abbreviation: 'NL',
      flag: <Image src={require('../../public/flags/nl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+31',
    },
    {
      abbreviation: 'HN',
      flag: <Image src={require('../../public/flags/hn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+504',
    },
    {
      abbreviation: 'HK',
      flag: <Image src={require('../../public/flags/hk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+852',
    },
    {
      abbreviation: 'HU',
      flag: <Image src={require('../../public/flags/hu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+36',
    },
    {
      abbreviation: 'IN',
      flag: <Image src={require('../../public/flags/in.svg')} alt="" width={18} height={12} />,
      phoneCode: '+91',
    },
    {
      abbreviation: 'ID',
      flag: <Image src={require('../../public/flags/id.svg')} alt="" width={18} height={12} />,
      phoneCode: '+62',
    },
    {
      abbreviation: 'IR',
      flag: <Image src={require('../../public/flags/ir.svg')} alt="" width={18} height={12} />,
      phoneCode: '+98',
    },
    {
      abbreviation: 'IQ',
      flag: <Image src={require('../../public/flags/iq.svg')} alt="" width={18} height={12} />,
      phoneCode: '+964',
    },
    {
      abbreviation: 'IE',
      flag: <Image src={require('../../public/flags/ie.svg')} alt="" width={18} height={12} />,
      phoneCode: '+353',
    },
    {
      abbreviation: 'IM',
      flag: <Image src={require('../../public/flags/im.svg')} alt="" width={18} height={12} />,
      phoneCode: '+44',
    },
    {
      abbreviation: 'IS',
      flag: <Image src={require('../../public/flags/is.svg')} alt="" width={18} height={12} />,
      phoneCode: '+354',
    },
    {
      abbreviation: 'FK',
      flag: <Image src={require('../../public/flags/fk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+500',
    },
    {
      abbreviation: 'MP',
      flag: <Image src={require('../../public/flags/mp.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 670',
    },
    {
      abbreviation: 'NF',
      flag: <Image src={require('../../public/flags/nf.svg')} alt="" width={18} height={12} />,
      phoneCode: '+672',
    },
    {
      abbreviation: 'SB',
      flag: <Image src={require('../../public/flags/sb.svg')} alt="" width={18} height={12} />,
      phoneCode: '+677',
    },
    {
      abbreviation: 'TC',
      flag: <Image src={require('../../public/flags/tc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 649',
    },
    {
      abbreviation: 'VG',
      flag: <Image src={require('../../public/flags/vg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 284',
    },
    {
      abbreviation: 'IO',
      flag: <Image src={require('../../public/flags/io.svg')} alt="" width={18} height={12} />,
      phoneCode: '+246',
    },
    {
      abbreviation: 'IT',
      flag: <Image src={require('../../public/flags/it.svg')} alt="" width={18} height={12} />,
      phoneCode: '+39',
    },
    {
      abbreviation: 'JM',
      flag: <Image src={require('../../public/flags/jm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 876',
    },
    {
      abbreviation: 'JP',
      flag: <Image src={require('../../public/flags/jp.svg')} alt="" width={18} height={12} />,
      phoneCode: '+81',
    },
    {
      abbreviation: 'JE',
      flag: <Image src={require('../../public/flags/je.svg')} alt="" width={18} height={12} />,
      phoneCode: '+44',
    },
    {
      abbreviation: 'JO',
      flag: <Image src={require('../../public/flags/jo.svg')} alt="" width={18} height={12} />,
      phoneCode: '+962',
    },
    {
      abbreviation: 'KZ',
      flag: <Image src={require('../../public/flags/kz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+7',
    },
    {
      abbreviation: 'KE',
      flag: <Image src={require('../../public/flags/ke.svg')} alt="" width={18} height={12} />,
      phoneCode: '+254',
    },
    {
      abbreviation: 'KG',
      flag: <Image src={require('../../public/flags/kg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+996',
    },
    {
      abbreviation: 'KI',
      flag: <Image src={require('../../public/flags/ki.svg')} alt="" width={18} height={12} />,
      phoneCode: '+686',
    },
    {
      abbreviation: 'KW',
      flag: <Image src={require('../../public/flags/kw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+965',
    },
    {
      abbreviation: 'LA',
      flag: <Image src={require('../../public/flags/la.svg')} alt="" width={18} height={12} />,
      phoneCode: '+856',
    },
    {
      abbreviation: 'LV',
      flag: <Image src={require('../../public/flags/lv.svg')} alt="" width={18} height={12} />,
      phoneCode: '+371',
    },
    {
      abbreviation: 'LS',
      flag: <Image src={require('../../public/flags/ls.svg')} alt="" width={18} height={12} />,
      phoneCode: '+266',
    },
    {
      abbreviation: 'LB',
      flag: <Image src={require('../../public/flags/lb.svg')} alt="" width={18} height={12} />,
      phoneCode: '+961',
    },
    {
      abbreviation: 'LR',
      flag: <Image src={require('../../public/flags/lr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+231',
    },
    {
      abbreviation: 'LY',
      flag: <Image src={require('../../public/flags/ly.svg')} alt="" width={18} height={12} />,
      phoneCode: '+218',
    },
    {
      abbreviation: 'LI',
      flag: <Image src={require('../../public/flags/li.svg')} alt="" width={18} height={12} />,
      phoneCode: '+423',
    },
    {
      abbreviation: 'LT',
      flag: <Image src={require('../../public/flags/lt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+370',
    },
    {
      abbreviation: 'LU',
      flag: <Image src={require('../../public/flags/lu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+352',
    },
    {
      abbreviation: 'MO',
      flag: <Image src={require('../../public/flags/mo.svg')} alt="" width={18} height={12} />,
      phoneCode: '+853',
    },
    {
      abbreviation: 'MK',
      flag: <Image src={require('../../public/flags/mk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+389',
    },
    {
      abbreviation: 'MG',
      flag: <Image src={require('../../public/flags/mg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+261',
    },
    {
      abbreviation: 'MY',
      flag: <Image src={require('../../public/flags/my.svg')} alt="" width={18} height={12} />,
      phoneCode: '+60',
    },
    {
      abbreviation: 'MW',
      flag: <Image src={require('../../public/flags/mw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+265',
    },
    {
      abbreviation: 'MV',
      flag: <Image src={require('../../public/flags/mv.svg')} alt="" width={18} height={12} />,
      phoneCode: '+960',
    },
    {
      abbreviation: 'ML',
      flag: <Image src={require('../../public/flags/ml.svg')} alt="" width={18} height={12} />,
      phoneCode: '+223',
    },
    {
      abbreviation: 'MT',
      flag: <Image src={require('../../public/flags/mt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+356',
    },
    {
      abbreviation: 'MA',
      flag: <Image src={require('../../public/flags/ma.svg')} alt="" width={18} height={12} />,
      phoneCode: '+212',
    },
    {
      abbreviation: 'MQ',
      flag: <Image src={require('../../public/flags/mq.svg')} alt="" width={18} height={12} />,
      phoneCode: '+596',
    },
    {
      abbreviation: 'MR',
      flag: <Image src={require('../../public/flags/mr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+222',
    },
    {
      abbreviation: 'MU',
      flag: <Image src={require('../../public/flags/mu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+230',
    },
    {
      abbreviation: 'YT',
      flag: <Image src={require('../../public/flags/yt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+262',
    },
    {
      abbreviation: 'UM',
      flag: <Image src={require('../../public/flags/um.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1',
    },
    {
      abbreviation: 'MX',
      flag: <Image src={require('../../public/flags/mx.svg')} alt="" width={18} height={12} />,
      phoneCode: '+52',
    },
    {
      abbreviation: 'FM',
      flag: <Image src={require('../../public/flags/fm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+691',
    },
    {
      abbreviation: 'MD',
      flag: <Image src={require('../../public/flags/md.svg')} alt="" width={18} height={12} />,
      phoneCode: '+373',
    },
    {
      abbreviation: 'MC',
      flag: <Image src={require('../../public/flags/mc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+377',
    },
    {
      abbreviation: 'MN',
      flag: <Image src={require('../../public/flags/mn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+976',
    },
    {
      abbreviation: 'ME',
      flag: <Image src={require('../../public/flags/me.svg')} alt="" width={18} height={12} />,
      phoneCode: '+382',
    },
    {
      abbreviation: 'MS',
      flag: <Image src={require('../../public/flags/ms.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 664',
    },
    {
      abbreviation: 'MZ',
      flag: <Image src={require('../../public/flags/mz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+258',
    },
    {
      abbreviation: 'NA',
      flag: <Image src={require('../../public/flags/na.svg')} alt="" width={18} height={12} />,
      phoneCode: '+264',
    },
    {
      abbreviation: 'NR',
      flag: <Image src={require('../../public/flags/nr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+674',
    },
    {
      abbreviation: 'NP',
      flag: <Image src={require('../../public/flags/np.svg')} alt="" width={18} height={12} />,
      phoneCode: '+977',
    },
    {
      abbreviation: 'NI',
      flag: <Image src={require('../../public/flags/ni.svg')} alt="" width={18} height={12} />,
      phoneCode: '+505',
    },
    {
      abbreviation: 'NE',
      flag: <Image src={require('../../public/flags/ne.svg')} alt="" width={18} height={12} />,
      phoneCode: '+227',
    },
    {
      abbreviation: 'NG',
      flag: <Image src={require('../../public/flags/ng.svg')} alt="" width={18} height={12} />,
      phoneCode: '+234',
    },
    {
      abbreviation: 'NU',
      flag: <Image src={require('../../public/flags/nu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+683',
    },
    {
      abbreviation: 'NO',
      flag: <Image src={require('../../public/flags/no.svg')} alt="" width={18} height={12} />,
      phoneCode: '+47',
    },
    {
      abbreviation: 'NC',
      flag: <Image src={require('../../public/flags/nc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+687',
    },
    {
      abbreviation: 'NZ',
      flag: <Image src={require('../../public/flags/nz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+64',
    },
    {
      abbreviation: 'OM',
      flag: <Image src={require('../../public/flags/om.svg')} alt="" width={18} height={12} />,
      phoneCode: '+968',
    },
    {
      abbreviation: 'PK',
      flag: <Image src={require('../../public/flags/pk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+92',
    },
    {
      abbreviation: 'PW',
      flag: <Image src={require('../../public/flags/pw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+680',
    },
    {
      abbreviation: 'PS',
      flag: <Image src={require('../../public/flags/ps.svg')} alt="" width={18} height={12} />,
      phoneCode: '+970',
    },
    {
      abbreviation: 'PA',
      flag: <Image src={require('../../public/flags/pa.svg')} alt="" width={18} height={12} />,
      phoneCode: '+507',
    },
    {
      abbreviation: 'PG',
      flag: <Image src={require('../../public/flags/pg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+675',
    },
    {
      abbreviation: 'PY',
      flag: <Image src={require('../../public/flags/py.svg')} alt="" width={18} height={12} />,
      phoneCode: '+595',
    },
    {
      abbreviation: 'PE',
      flag: <Image src={require('../../public/flags/pe.svg')} alt="" width={18} height={12} />,
      phoneCode: '+51',
    },
    {
      abbreviation: 'PN',
      flag: <Image src={require('../../public/flags/pn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+64',
    },
    {
      abbreviation: 'PF',
      flag: <Image src={require('../../public/flags/pf.svg')} alt="" width={18} height={12} />,
      phoneCode: '+689',
    },
    {
      abbreviation: 'PL',
      flag: <Image src={require('../../public/flags/pl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+48',
    },
    {
      abbreviation: 'PT',
      flag: <Image src={require('../../public/flags/pt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+351',
    },
    {
      abbreviation: 'PR',
      flag: <Image src={require('../../public/flags/pr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 787',
    },
    {
      abbreviation: 'QA',
      flag: <Image src={require('../../public/flags/qa.svg')} alt="" width={18} height={12} />,
      phoneCode: '+974',
    },
    {
      abbreviation: 'KE',
      flag: <Image src={require('../../public/flags/ke.svg')} alt="" width={18} height={12} />,
      phoneCode: '+254',
    },
    {
      abbreviation: 'UK',
      flag: <Image src={require('../../public/flags/sh.svg')} alt="" width={18} height={12} />,
      phoneCode: '+44',
    },
    {
      abbreviation: 'CF',
      flag: <Image src={require('../../public/flags/cf.svg')} alt="" width={18} height={12} />,
      phoneCode: '+236',
    },
    {
      abbreviation: 'CZ',
      flag: <Image src={require('../../public/flags/cz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+420',
    },
    {
      abbreviation: 'DO',
      flag: <Image src={require('../../public/flags/do.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 809',
    },
    {
      abbreviation: 'RO',
      flag: <Image src={require('../../public/flags/ro.svg')} alt="" width={18} height={12} />,
      phoneCode: '+40',
    },
    {
      abbreviation: 'RU',
      flag: <Image src={require('../../public/flags/ru.svg')} alt="" width={18} height={12} />,
      phoneCode: '+7',
    },
    {
      abbreviation: 'RW',
      flag: <Image src={require('../../public/flags/rw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+250',
    },
    {
      abbreviation: 'KN',
      flag: <Image src={require('../../public/flags/kn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 869',
    },
    {
      abbreviation: 'LC',
      flag: <Image src={require('../../public/flags/lc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 758',
    },
    {
      abbreviation: 'VC',
      flag: <Image src={require('../../public/flags/vc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 784',
    },
    {
      abbreviation: 'WS',
      flag: <Image src={require('../../public/flags/ws.svg')} alt="" width={18} height={12} />,
      phoneCode: '+685',
    },
    {
      abbreviation: 'SM',
      flag: <Image src={require('../../public/flags/sm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+378',
    },
    {
      abbreviation: 'ST',
      flag: <Image src={require('../../public/flags/st.svg')} alt="" width={18} height={12} />,
      phoneCode: '+239',
    },
    {
      abbreviation: 'SN',
      flag: <Image src={require('../../public/flags/sn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+221',
    },
    {
      abbreviation: 'RS',
      flag: <Image src={require('../../public/flags/rs.svg')} alt="" width={18} height={12} />,
      phoneCode: '+381',
    },
    {
      abbreviation: 'SC',
      flag: <Image src={require('../../public/flags/sc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+248',
    },
    {
      abbreviation: 'SL',
      flag: <Image src={require('../../public/flags/sl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+232',
    },
    {
      abbreviation: 'SG',
      flag: <Image src={require('../../public/flags/sg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+65',
    },
    {
      abbreviation: 'SX',
      flag: <Image src={require('../../public/flags/sx.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 721',
    },
    {
      abbreviation: 'SY',
      flag: <Image src={require('../../public/flags/sy.svg')} alt="" width={18} height={12} />,
      phoneCode: '+963',
    },
    {
      abbreviation: 'SO',
      flag: <Image src={require('../../public/flags/so.svg')} alt="" width={18} height={12} />,
      phoneCode: '+252',
    },
    {
      abbreviation: 'LK',
      flag: <Image src={require('../../public/flags/lk.svg')} alt="" width={18} height={12} />,
      phoneCode: '+94',
    },
    {
      abbreviation: 'SZ',
      flag: <Image src={require('../../public/flags/sz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+268',
    },
    {
      abbreviation: 'ZA',
      flag: <Image src={require('../../public/flags/za.svg')} alt="" width={18} height={12} />,
      phoneCode: '+27',
    },
    {
      abbreviation: 'SD',
      flag: <Image src={require('../../public/flags/sd.svg')} alt="" width={18} height={12} />,
      phoneCode: '+249',
    },
    {
      abbreviation: 'SS',
      flag: <Image src={require('../../public/flags/ss.svg')} alt="" width={18} height={12} />,
      phoneCode: '+211',
    },
    {
      abbreviation: 'SE',
      flag: <Image src={require('../../public/flags/se.svg')} alt="" width={18} height={12} />,
      phoneCode: '+46',
    },
    {
      abbreviation: 'CH',
      flag: <Image src={require('../../public/flags/ch.svg')} alt="" width={18} height={12} />,
      phoneCode: '+41',
    },
    {
      abbreviation: 'SR',
      flag: <Image src={require('../../public/flags/sr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+597',
    },
    {
      abbreviation: 'TJ',
      flag: <Image src={require('../../public/flags/tj.svg')} alt="" width={18} height={12} />,
      phoneCode: '+992',
    },
    {
      abbreviation: 'TH',
      flag: <Image src={require('../../public/flags/th.svg')} alt="" width={18} height={12} />,
      phoneCode: '+66',
    },
    {
      abbreviation: 'TW',
      flag: <Image src={require('../../public/flags/tw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+886',
    },
    {
      abbreviation: 'TZ',
      flag: <Image src={require('../../public/flags/tz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+255',
    },
    {
      abbreviation: 'TL',
      flag: <Image src={require('../../public/flags/tl.svg')} alt="" width={18} height={12} />,
      phoneCode: '+670',
    },
    {
      abbreviation: 'TG',
      flag: <Image src={require('../../public/flags/tg.svg')} alt="" width={18} height={12} />,
      phoneCode: '+228',
    },
    {
      abbreviation: 'TO',
      flag: <Image src={require('../../public/flags/to.svg')} alt="" width={18} height={12} />,
      phoneCode: '+676',
    },
    {
      abbreviation: 'TT',
      flag: <Image src={require('../../public/flags/tt.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 868',
    },
    {
      abbreviation: 'TN',
      flag: <Image src={require('../../public/flags/tn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+216',
    },
    {
      abbreviation: 'TR',
      flag: <Image src={require('../../public/flags/tr.svg')} alt="" width={18} height={12} />,
      phoneCode: '+90',
    },
    {
      abbreviation: 'TM',
      flag: <Image src={require('../../public/flags/tm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+993',
    },
    {
      abbreviation: 'TC',
      flag: <Image src={require('../../public/flags/tc.svg')} alt="" width={18} height={12} />,
      phoneCode: '+1 649',
    },
    {
      abbreviation: 'TV',
      flag: <Image src={require('../../public/flags/tv.svg')} alt="" width={18} height={12} />,
      phoneCode: '+688',
    },
    {
      abbreviation: 'UA',
      flag: <Image src={require('../../public/flags/ua.svg')} alt="" width={18} height={12} />,
      phoneCode: '+380',
    },
    {
      abbreviation: 'UG',
      flag: <Image src={require('../../public/flags/ug.svg')} alt="" width={18} height={12} />,
      phoneCode: '+256',
    },
    {
      abbreviation: 'UY',
      flag: <Image src={require('../../public/flags/uy.svg')} alt="" width={18} height={12} />,
      phoneCode: '+598',
    },
    {
      abbreviation: 'UZ',
      flag: <Image src={require('../../public/flags/uz.svg')} alt="" width={18} height={12} />,
      phoneCode: '+998',
    },
    {
      abbreviation: 'VU',
      flag: <Image src={require('../../public/flags/vu.svg')} alt="" width={18} height={12} />,
      phoneCode: '+678',
    },
    {
      abbreviation: 'VE',
      flag: <Image src={require('../../public/flags/ve.svg')} alt="" width={18} height={12} />,
      phoneCode: '+58',
    },
    {
      abbreviation: 'VN',
      flag: <Image src={require('../../public/flags/vn.svg')} alt="" width={18} height={12} />,
      phoneCode: '+84',
    },
    {
      abbreviation: 'WF',
      flag: <Image src={require('../../public/flags/wf.svg')} alt="" width={18} height={12} />,
      phoneCode: '+681',
    },
    {
      abbreviation: 'YE',
      flag: <Image src={require('../../public/flags/ye.svg')} alt="" width={18} height={12} />,
      phoneCode: '+967',
    },
    {
      abbreviation: 'ZM',
      flag: <Image src={require('../../public/flags/zm.svg')} alt="" width={18} height={12} />,
      phoneCode: '+260',
    },
    {
      abbreviation: 'ZW',
      flag: <Image src={require('../../public/flags/zw.svg')} alt="" width={18} height={12} />,
      phoneCode: '+263',
    },
  ];
  
  export default codigoArea;
  