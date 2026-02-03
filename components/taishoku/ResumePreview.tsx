'use client'

import { useState } from 'react'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Edit3,
  Check,
  X,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react'
import type { ResumeData } from '@/lib/gemini'

interface ResumePreviewProps {
  resume: ResumeData
  onUpdate: (resume: ResumeData) => void
  onRefine: (instructions: string) => Promise<void>
  isRefining: boolean
}

export function ResumePreview({ resume, onUpdate, onRefine, isRefining }: ResumePreviewProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [refineInput, setRefineInput] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // 編集を開始
  const startEditing = (section: string, value: string, index?: number) => {
    setEditingSection(section)
    setEditValue(value)
    setEditIndex(index ?? null)
  }

  // 編集を保存
  const saveEdit = () => {
    if (!editingSection) return

    const updatedResume = { ...resume }

    switch (editingSection) {
      case 'selfPR':
        updatedResume.selfPR = editValue
        break
      case 'workHistory':
        if (editIndex !== null) {
          const workHistory = [...(updatedResume.workHistory || [])]
          const [field, ...rest] = editValue.split('|||')
          if (rest.length === 3) {
            workHistory[editIndex] = {
              companyName: field,
              period: rest[0],
              position: rest[1],
              description: rest[2]
            }
          }
          updatedResume.workHistory = workHistory
        }
        break
      case 'education':
        if (editIndex !== null) {
          const education = [...(updatedResume.education || [])]
          const [school, major, year] = editValue.split('|||')
          education[editIndex] = {
            schoolName: school || '',
            major: major || '',
            graduationYear: year || ''
          }
          updatedResume.education = education
        }
        break
      case 'qualifications':
        updatedResume.qualifications = editValue.split('\n').filter(q => q.trim())
        break
      case 'skills':
        updatedResume.skills = editValue.split('\n').filter(s => s.trim())
        break
    }

    onUpdate(updatedResume)
    setEditingSection(null)
    setEditValue('')
    setEditIndex(null)
  }

  // 編集をキャンセル
  const cancelEdit = () => {
    setEditingSection(null)
    setEditValue('')
    setEditIndex(null)
  }

  // AI修正を実行
  const handleRefine = async () => {
    if (!refineInput.trim()) return
    await onRefine(refineInput)
    setRefineInput('')
  }

  // 職歴を追加
  const addWorkHistory = () => {
    const updatedResume = { ...resume }
    updatedResume.workHistory = [
      ...(updatedResume.workHistory || []),
      { companyName: '', period: '', position: '', description: '' }
    ]
    onUpdate(updatedResume)
    startEditing('workHistory', '|||||||', updatedResume.workHistory.length - 1)
  }

  // 職歴を削除
  const removeWorkHistory = (index: number) => {
    const updatedResume = { ...resume }
    updatedResume.workHistory = updatedResume.workHistory.filter((_, i) => i !== index)
    onUpdate(updatedResume)
  }

  // 学歴を追加
  const addEducation = () => {
    const updatedResume = { ...resume }
    updatedResume.education = [
      ...(updatedResume.education || []),
      { schoolName: '', major: '', graduationYear: '' }
    ]
    onUpdate(updatedResume)
    startEditing('education', '||||||', updatedResume.education.length - 1)
  }

  // 学歴を削除
  const removeEducation = (index: number) => {
    const updatedResume = { ...resume }
    updatedResume.education = updatedResume.education.filter((_, i) => i !== index)
    onUpdate(updatedResume)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          履歴書プレビュー
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          内容を確認・編集してください
        </p>
      </div>

      {/* AI修正入力 */}
      <div className="bg-brand-cyan/5 dark:bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              AIに修正を依頼
            </p>
            <textarea
              value={refineInput}
              onChange={(e) => setRefineInput(e.target.value)}
              placeholder="例: 自己PRをもっと具体的にしてください、職歴の説明を簡潔にしてください"
              className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan resize-none"
              rows={2}
            />
            <button
              onClick={handleRefine}
              disabled={!refineInput.trim() || isRefining}
              className="mt-2 px-4 py-2 bg-brand-cyan text-white text-sm font-medium rounded-lg hover:bg-brand-cyan-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRefining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  修正中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AIで修正
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 履歴書プレビュー */}
      <div className="bg-white dark:bg-midnight-800 rounded-2xl border border-slate-200 dark:border-midnight-600 shadow-lg overflow-hidden">
        {/* 基本情報 */}
        <div className="bg-gradient-to-r from-brand-cyan/10 to-brand-cyan/5 dark:from-brand-cyan/20 dark:to-brand-cyan/10 px-6 py-5 border-b border-slate-200 dark:border-midnight-600">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {resume.personalInfo.name || '氏名未入力'}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {resume.personalInfo.phone || '電話番号未入力'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {resume.personalInfo.age ? `${resume.personalInfo.age}歳` : '年齢未入力'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {resume.personalInfo.prefecture || '都道府県未入力'}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 職歴 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Briefcase className="w-5 h-5 text-brand-cyan" />
                職歴
              </h4>
              <button
                onClick={addWorkHistory}
                className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                追加
              </button>
            </div>
            {resume.workHistory && resume.workHistory.length > 0 ? (
              <div className="space-y-4">
                {resume.workHistory.map((work, index) => (
                  <div
                    key={index}
                    className="group relative bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4 border border-slate-200 dark:border-midnight-600"
                  >
                    {editingSection === 'workHistory' && editIndex === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editValue.split('|||')[0] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[0] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="会社名"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={editValue.split('|||')[1] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[1] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="期間（例: 2020年4月〜2023年3月）"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={editValue.split('|||')[2] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[2] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="役職"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <textarea
                          value={editValue.split('|||')[3] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[3] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="業務内容"
                          rows={3}
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={() => startEditing('workHistory', `${work.companyName}|||${work.period}|||${work.position}|||${work.description}`, index)}
                            className="p-1 text-slate-500 hover:text-brand-cyan rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeWorkHistory(index)}
                            className="p-1 text-slate-500 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {work.companyName || '会社名未入力'}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                          {work.period} {work.position && `/ ${work.position}`}
                        </div>
                        {work.description && (
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {work.description}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                職歴情報がありません
              </p>
            )}
          </section>

          {/* 学歴 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <GraduationCap className="w-5 h-5 text-brand-cyan" />
                学歴
              </h4>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                追加
              </button>
            </div>
            {resume.education && resume.education.length > 0 ? (
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div
                    key={index}
                    className="group relative bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4 border border-slate-200 dark:border-midnight-600"
                  >
                    {editingSection === 'education' && editIndex === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editValue.split('|||')[0] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[0] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="学校名"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={editValue.split('|||')[1] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[1] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="専攻・学部"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={editValue.split('|||')[2] || ''}
                          onChange={(e) => {
                            const parts = editValue.split('|||')
                            parts[2] = e.target.value
                            setEditValue(parts.join('|||'))
                          }}
                          placeholder="卒業年（例: 2020年）"
                          className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm"
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={() => startEditing('education', `${edu.schoolName}|||${edu.major}|||${edu.graduationYear}`, index)}
                            className="p-1 text-slate-500 hover:text-brand-cyan rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeEducation(index)}
                            className="p-1 text-slate-500 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {edu.schoolName || '学校名未入力'}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-300">
                          {edu.major} {edu.graduationYear && `(${edu.graduationYear}卒業)`}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                学歴情報がありません
              </p>
            )}
          </section>

          {/* 資格 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Award className="w-5 h-5 text-brand-cyan" />
                資格・スキル
              </h4>
              <button
                onClick={() => startEditing('qualifications', (resume.qualifications || []).join('\n'))}
                className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan-dark transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                編集
              </button>
            </div>
            {editingSection === 'qualifications' ? (
              <div className="space-y-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="資格を1行ずつ入力"
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : resume.qualifications && resume.qualifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.qualifications.map((qual, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-sm rounded-full"
                  >
                    {qual}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                資格情報がありません
              </p>
            )}
          </section>

          {/* スキル */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Sparkles className="w-5 h-5 text-brand-cyan" />
                スキル
              </h4>
              <button
                onClick={() => startEditing('skills', (resume.skills || []).join('\n'))}
                className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan-dark transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                編集
              </button>
            </div>
            {editingSection === 'skills' ? (
              <div className="space-y-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="スキルを1行ずつ入力"
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : resume.skills && resume.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gold-bright/20 text-gold-bright text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                スキル情報がありません
              </p>
            )}
          </section>

          {/* 自己PR */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <User className="w-5 h-5 text-brand-cyan" />
                自己PR
              </h4>
              <button
                onClick={() => startEditing('selfPR', resume.selfPR || '')}
                className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan-dark transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                編集
              </button>
            </div>
            {editingSection === 'selfPR' ? (
              <div className="space-y-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="自己PRを入力"
                  rows={5}
                  className="w-full px-3 py-2 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : resume.selfPR ? (
              <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4 border border-slate-200 dark:border-midnight-600">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {resume.selfPR}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                自己PRがありません
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
