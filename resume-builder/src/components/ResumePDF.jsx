// ResumePDF.jsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register TTF font for Poppins (must be .ttf!)
Font.register({
  family: 'Poppins',
  src: 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Poppins',
    fontSize: 11,
    color: '#1a1a1a',
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 12,
    textAlign: 'center',
    color: 'white',
    borderRadius: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  listItem: {
    marginBottom: 4,
  },
  bullet: {
    marginRight: 4,
  },
});

const ResumePDF = ({ resumeData = {} }) => {
  const personal = resumeData.personal || {};
  const education = resumeData.education || [];
  const experience = resumeData.experience || [];
  const skills = [
    ...(resumeData.programmingSkills || []),
    ...(resumeData.frameworks || []),
    ...(resumeData.softSkills || [])
  ];
  const projects = resumeData.projects || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.name || 'Your Name'}</Text>
          <Text style={styles.title}>{personal.title || 'Your Title'}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{personal.email || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{personal.phone || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{personal.location || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>LinkedIn:</Text>
            <Text style={styles.value}>{personal.linkedin || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GitHub:</Text>
            <Text style={styles.value}>{personal.github || '-'}</Text>
          </View>
        </View>

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text>{edu.degree} - {edu.institution} ({edu.year})</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text>{exp.role} at {exp.company} ({exp.duration})</Text>
                <Text>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text>{proj.name}</Text>
                <Text>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View>
              {skills.map((skill, idx) => (
                <Text key={idx}>• {skill.name}</Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
