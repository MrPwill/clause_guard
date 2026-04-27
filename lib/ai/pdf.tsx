import React from 'react';
import {
  Document as PDFDocument,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    color: '#1A2B4A',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2D9CFF',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A2B4A',
  },
  tagline: {
    fontSize: 10,
    color: '#00C2B8',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  metadata: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 30,
    fontSize: 10,
    color: '#666',
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A2B4A',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A2B4A',
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1A2B4A',
  },
  heading3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#1A2B4A',
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'justify',
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 20,
  },
  number: {
    width: 20,
    fontWeight: 'bold',
    color: '#2D9CFF',
  },
  listContent: {
    flex: 1,
    fontSize: 11,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 20,
  },
  bullet: {
    width: 10,
    fontSize: 12,
    color: '#00C2B8',
  },
  disclaimerBox: {
    backgroundColor: '#FFC83D',
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A2B4A',
  },
  disclaimerText: {
    fontSize: 9,
    color: '#1A2B4A',
    lineHeight: 1.4,
  },
  signatureBlock: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 60,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signatureImage: {
    height: 60,
    marginBottom: 4,
  },
  signatureDate: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
    fontSize: 8,
    color: '#999',
  },
  pageNumber: {
    fontSize: 8,
    color: '#999',
  },
});

interface PDFRendererProps {
  title: string;
  jurisdiction: string;
  docType: string;
  generatedDate: string;
  content: string;
  signatureBase64?: string;
  signedDate?: string;
}

export function ClauseGuardPDF({
  title,
  jurisdiction,
  docType,
  generatedDate,
  content,
  signatureBase64,
  signedDate,
}: PDFRendererProps) {
  const lines = content.split('\n');
  const sections: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      sections.push(
        <Text key={`h2-${i}`} style={styles.heading2}>
          {line.replace('## ', '')}
        </Text>
      );
    } else if (line.startsWith('### ')) {
      sections.push(
        <Text key={`h3-${i}`} style={styles.heading3}>
          {line.replace('### ', '')}
        </Text>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      sections.push(
        <Text key={`bold-${i}`} style={{ ...styles.paragraph, fontWeight: 'bold' }}>
          {line.replace(/\*\*/g, '')}
        </Text>
      );
    } else if (line.match(/^\d+\./)) {
      const match = line.match(/^(\d+\.)\s+(.*)/);
      if (match) {
        sections.push(
          <View key={`num-${i}`} style={styles.numberedItem}>
            <Text style={styles.number}>{match[1]}</Text>
            <Text style={styles.listContent}>{match[2]}</Text>
          </View>
        );
      }
    } else if (line.startsWith('- ')) {
      sections.push(
        <View key={`bullet-${i}`} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listContent}>{line.replace('- ', '')}</Text>
        </View>
      );
    } else if (line.trim()) {
      sections.push(
        <Text key={`p-${i}`} style={styles.paragraph}>
          {line}
        </Text>
      );
    }

    i++;
  }

  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>ClauseGuard</Text>
          <Text style={styles.tagline}>AFRICA</Text>
        </View>

        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Document Title</Text>
            <Text style={styles.metaValue}>{title}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Jurisdiction</Text>
            <Text style={styles.metaValue}>{jurisdiction}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Type</Text>
            <Text style={styles.metaValue}>{docType}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Generated</Text>
            <Text style={styles.metaValue}>{generatedDate}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        {sections}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ IMPORTANT DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>
            This document was generated by AI for informational purposes only. It does not constitute legal advice. 
            Review with a qualified legal professional before use. ClauseGuard is not a law firm.
          </Text>
        </View>

        <View style={styles.signatureBlock}>
          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Signature 1:</Text>
            {signatureBase64 ? (
              <>
                <Image src={signatureBase64} style={styles.signatureImage} />
                {signedDate && (
                  <Text style={styles.signatureDate}>Signed: {signedDate}</Text>
                )}
              </>
            ) : (
              <View style={styles.signatureLine}>
                <Text style={{ fontSize: 9, color: '#999' }}>Signature pending</Text>
              </View>
            )}
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Signature 2:</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text>ClauseGuard Africa</Text>
          <Text style={styles.pageNumber}>Page 1</Text>
        </View>
      </Page>
    </PDFDocument>
  );
}
