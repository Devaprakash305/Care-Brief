import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { LoadingState } from '../components/common/LoadingState'
import { summaryService } from '../services/supabaseSummaryService'
import { ClinicalNote } from '../types'
import { FileText, Search, Sparkles, Eye, User } from 'lucide-react'

export const ClinicalNotesPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)

  useEffect(() => {
    async function loadNotes() {
      setLoading(true)
      try {
        const list = await summaryService.getAllClinicalNotes()
        setNotes(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadNotes()
  }, [])

  const filteredNotes = notes.filter(
    (n) =>
      n.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.rawContent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState title="Loading EHR Clinical Notes..." description="Accessing inpatient hospital summaries and admission notes." />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Clinical Notes Repository"
        subtitle="Browse raw EHR physician notes and discharge documentation."
        actions={
          <Button variant="primary" onClick={() => navigate('/new-summary')} icon={<Sparkles className="w-4 h-4 text-teal-300" />}>
            Create Summary
          </Button>
        }
      />

      {/* Filter / Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Filter notes by patient, physician, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Notes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Note ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Attending Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-mono text-xs font-semibold text-slate-800">{note.id}</TableCell>
                <TableCell className="font-medium text-slate-900">{note.patientName}</TableCell>
                <TableCell className="text-slate-600">{note.author}</TableCell>
                <TableCell className="text-slate-500">{note.noteType}</TableCell>
                <TableCell className="text-xs text-slate-500">{note.createdDate}</TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedNote(note)} icon={<Eye className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/new-summary?patientId=${note.patientId}`)}
                    icon={<Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                  >
                    Simplify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Note Modal */}
      {selectedNote && (
        <Modal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          title={`Clinical Note: ${selectedNote.patientName} (${selectedNote.id})`}
          description={`Author: ${selectedNote.author} | Date: ${selectedNote.createdDate}`}
          maxWidth="2xl"
          footer={
            <Button
              variant="primary"
              onClick={() => {
                setSelectedNote(null)
                navigate(`/new-summary?patientId=${selectedNote.patientId}`)
              }}
              icon={<Sparkles className="w-4 h-4 text-teal-300" />}
            >
              Convert to Plain Summary
            </Button>
          }
        >
          <div className="space-y-4 text-xs font-mono text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">
            {selectedNote.rawContent}
          </div>
        </Modal>
      )}
    </div>
  )
}
