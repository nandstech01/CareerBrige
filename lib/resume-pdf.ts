import type { ResumeData } from './gemini';

// PDF生成用のスタイル定義（@react-pdf/renderer用）
export const pdfStyles = {
  page: {
    padding: 40,
    fontFamily: 'Noto Sans JP',
    fontSize: 10,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #3CC8E8',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  contactInfo: {
    flexDirection: 'row' as const,
    gap: 20,
    fontSize: 10,
    color: '#64748b',
  },
  contactItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3CC8E8',
    marginBottom: 10,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 5,
  },
  workItem: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeft: '2px solid #e2e8f0',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  period: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  description: {
    fontSize: 10,
    color: '#475569',
    marginTop: 5,
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeft: '2px solid #e2e8f0',
  },
  schoolName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  major: {
    fontSize: 9,
    color: '#64748b',
  },
  tagContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0fdfa',
    color: '#0d9488',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
  },
  skillTag: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
  },
  selfPR: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center' as const,
    fontSize: 8,
    color: '#94a3b8',
  },
};

// 履歴書データをPDF用にフォーマット
export function formatResumeForPdf(resume: ResumeData): {
  name: string;
  phone: string;
  age: string;
  prefecture: string;
  workHistory: Array<{
    companyName: string;
    period: string;
    position: string;
    description: string;
  }>;
  education: Array<{
    schoolName: string;
    major: string;
    graduationYear: string;
  }>;
  qualifications: string[];
  skills: string[];
  selfPR: string;
} {
  return {
    name: resume.personalInfo.name || '',
    phone: resume.personalInfo.phone || '',
    age: resume.personalInfo.age || '',
    prefecture: resume.personalInfo.prefecture || '',
    workHistory: resume.workHistory || [],
    education: resume.education || [],
    qualifications: resume.qualifications || [],
    skills: resume.skills || [],
    selfPR: resume.selfPR || '',
  };
}

// 履歴書データをテキスト形式で出力（フォールバック用）
export function formatResumeAsText(resume: ResumeData): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push('                履 歴 書                ');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  // 基本情報
  lines.push('【基本情報】');
  lines.push(`氏名: ${resume.personalInfo.name || '未入力'}`);
  lines.push(`電話番号: ${resume.personalInfo.phone || '未入力'}`);
  lines.push(`年齢: ${resume.personalInfo.age ? `${resume.personalInfo.age}歳` : '未入力'}`);
  lines.push(`都道府県: ${resume.personalInfo.prefecture || '未入力'}`);
  lines.push('');

  // 職歴
  lines.push('【職歴】');
  if (resume.workHistory && resume.workHistory.length > 0) {
    resume.workHistory.forEach((work, index) => {
      lines.push(`${index + 1}. ${work.companyName || '会社名未入力'}`);
      lines.push(`   期間: ${work.period || '未入力'}`);
      lines.push(`   役職: ${work.position || '未入力'}`);
      lines.push(`   業務内容: ${work.description || '未入力'}`);
      lines.push('');
    });
  } else {
    lines.push('   職歴情報なし');
    lines.push('');
  }

  // 学歴
  lines.push('【学歴】');
  if (resume.education && resume.education.length > 0) {
    resume.education.forEach((edu, index) => {
      lines.push(`${index + 1}. ${edu.schoolName || '学校名未入力'}`);
      lines.push(`   専攻: ${edu.major || '未入力'}`);
      lines.push(`   卒業年: ${edu.graduationYear || '未入力'}`);
    });
  } else {
    lines.push('   学歴情報なし');
  }
  lines.push('');

  // 資格
  lines.push('【資格】');
  if (resume.qualifications && resume.qualifications.length > 0) {
    resume.qualifications.forEach(qual => {
      lines.push(`   ・${qual}`);
    });
  } else {
    lines.push('   資格情報なし');
  }
  lines.push('');

  // スキル
  lines.push('【スキル】');
  if (resume.skills && resume.skills.length > 0) {
    lines.push(`   ${resume.skills.join(' / ')}`);
  } else {
    lines.push('   スキル情報なし');
  }
  lines.push('');

  // 自己PR
  lines.push('【自己PR】');
  if (resume.selfPR) {
    lines.push(resume.selfPR);
  } else {
    lines.push('   自己PR未入力');
  }
  lines.push('');

  lines.push('═══════════════════════════════════════');
  lines.push('CareerBridge で作成');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

// 履歴書データをCSV形式で出力（スプレッドシート保存用）
export function formatResumeAsCsv(resume: ResumeData): Record<string, string> {
  return {
    name: resume.personalInfo.name || '',
    phone: resume.personalInfo.phone || '',
    age: resume.personalInfo.age || '',
    prefecture: resume.personalInfo.prefecture || '',
    workHistory: JSON.stringify(resume.workHistory || []),
    education: JSON.stringify(resume.education || []),
    qualifications: (resume.qualifications || []).join(', '),
    skills: (resume.skills || []).join(', '),
    selfPR: resume.selfPR || '',
    rawTranscript: resume.rawTranscript || '',
  };
}
