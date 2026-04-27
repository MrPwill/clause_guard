import React from 'react';
import {
  Document as PDFDocument,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EoA.ttf' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    color: '#1A2B4A',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2D9CFF',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 7,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1A2B4A',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1A2B4A',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#1A2B4A',
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#1A2B4A',
  },
  clauseNumber: {
    width: 25,
    fontWeight: 'bold',
    color: '#2D9CFF',
  },
  clauseText: {
    flex: 1,
  },
  clauseRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 15,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: '#00C2B8',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 15,
  },
  plainText: {
    marginBottom: 6,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
  },
  disclaimerBox: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    marginTop: 20,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC83D',
  },
  disclaimerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A2B4A',
  },
  disclaimerText: {
    fontSize: 8,
    color: '#1A2B4A',
    lineHeight: 1.4,
  },
  signatureBlock: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  signatureSection: {
    marginBottom: 15,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signatureImage: {
    height: 40,
  },
  signatureDate: {
    fontSize: 8,
    color: '#666',
    marginTop: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
  pageBreak: {
    flexBasis: '100%',
    height: 0,
  },
});

function cleanText(text: string): string {
  return text
    .replace(/\[113;5u/g, '')
    .replace(/Third\s+Party/g, 'Third Party')
    .replace(/\*\*/g, '')
    .trim();
}

interface PDFRendererProps {
  title: string;
  jurisdiction: string;
  docType: string;
  generatedDate: string;
  content: string;
  signatureBase64?: string;
  signedDate?: string;
}

function parseContent(content: string): React.ReactNode[] {
  const sections: React.ReactNode[] = [];
  const lines = content.split('\n');
  
  let i = 0;
  let sectionKey = 0;
  
  while (i < lines.length) {
    let line = cleanText(lines[i]);
    
    if (!line.trim()) {
      i++;
      continue;
    }
    
    if (line.startsWith('## ')) {
      sections.push(
        <Text key={`section-${sectionKey++}`} style={styles.sectionTitle}>
          {line.replace('## ', '')}
        </Text>
      );
    } else if (line.startsWith('### ')) {
      sections.push(
        <Text key={`subsection-${sectionKey++}`} style={styles.subsectionTitle}>
          {line.replace('### ', '')}
        </Text>
      );
    } else if (line.match(/^\d+\.(\d+)?\.?\s*/)) {
      const match = line.match(/^(\d+\.)+\s*(.*)/);
      if (match) {
        sections.push(
          <View key={`clause-${sectionKey++}`} style={styles.clauseRow}>
            <Text style={styles.clauseNumber}>{match[1]}</Text>
            <Text style={styles.clauseText}>{match[2]}</Text>
          </View>
        );
      }
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      sections.push(
        <View key={`bullet-${sectionKey++}`} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.clauseText}>{line.replace(/^[-•] /, '')}</Text>
        </View>
      );
    } else {
      sections.push(
        <Text key={`text-${sectionKey++}`} style={styles.plainText}>
          {line}
        </Text>
      );
    }
    
    i++;
  }
  
  return sections;
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
  const sections = parseContent(content);
  const jurisdictionName = jurisdiction === 'NG' ? 'Nigeria' : 
                       jurisdiction === 'KE' ? 'Kenya' : 
                       jurisdiction === 'GH' ? 'Ghana' : 'South Africa';

  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Document</Text>
            <Text style={styles.metaValue}>{title}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Jurisdiction</Text>
            <Text style={styles.metaValue}>{jurisdictionName}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Type</Text>
            <Text style={styles.metaValue}>{docType}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{generatedDate}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        {sections}

        <View style={styles.signatureBlock}>
          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Client/Provider Signature:</Text>
            {signatureBase64 ? (
              <>
                <Image src={signatureBase64} style={styles.signatureImage} />
                {signedDate && (
                  <Text style={styles.signatureDate}>Signed: {signedDate}</Text>
                )}
              </>
            ) : (
              <View style={styles.signatureLine}>
                <Text style={{ fontSize: 8, color: '#999' }}>Signature pending</Text>
              </View>
            )}
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Other Party Signature:</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8, color: '#999' }}>Signature pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </PDFDocument>
  );
}