import type { Jurisdiction } from '@/types/document';

export const JURISDICTION_META: Record<Jurisdiction, {
  fullName: string;
  currency: string;
  flag: string;
  governingLaw: string;
  dataLaw: string;
  companyLaw: string;
  labourLaw: string;
  minAnnualLeaveDays: number;
}> = {
  NG: {
    fullName: 'Nigeria',
    currency: 'NGN',
    flag: '🇳🇬',
    governingLaw: 'the laws of the Federal Republic of Nigeria',
    dataLaw: 'Nigeria Data Protection Regulation (NDPR) 2019',
    companyLaw: 'Companies and Allied Matters Act (CAMA) 2020',
    labourLaw: 'Labour Act Cap L1 LFN 2004',
    minAnnualLeaveDays: 6,
  },
  KE: {
    fullName: 'Kenya',
    currency: 'KES',
    flag: '🇰🇪',
    governingLaw: 'the laws of the Republic of Kenya',
    dataLaw: 'Data Protection Act 2019',
    companyLaw: 'Companies Act 2015',
    labourLaw: 'Employment Act 2007',
    minAnnualLeaveDays: 21,
  },
  GH: {
    fullName: 'Ghana',
    currency: 'GHS',
    flag: '🇬🇭',
    governingLaw: 'the laws of the Republic of Ghana',
    dataLaw: 'Data Protection Act 2012',
    companyLaw: 'Companies Act 2019 (Act 992)',
    labourLaw: 'Labour Act 2003 (Act 651)',
    minAnnualLeaveDays: 15,
  },
  ZA: {
    fullName: 'South Africa',
    currency: 'ZAR',
    flag: '🇿🇦',
    governingLaw: 'the laws of the Republic of South Africa',
    dataLaw: 'Protection of Personal Information Act (POPIA) 2013',
    companyLaw: 'Companies Act 71 of 2008',
    labourLaw: 'Basic Conditions of Employment Act 75 of 1997',
    minAnnualLeaveDays: 15,
  },
};