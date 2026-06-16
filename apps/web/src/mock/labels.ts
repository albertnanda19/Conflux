import { LABELS, MOCK_CONVERSATIONS, type Label } from './inbox'

let nextId = 7
let localLabels: Label[] = [...LABELS]

export function getLabels(): Label[] {
  return [...localLabels]
}

export function getLabelById(id: string): Label | undefined {
  return localLabels.find((l) => l.id === id)
}

export function createLabel(name: string, color: string): Label {
  const label: Label = { id: `l${nextId++}`, name, color }
  localLabels.push(label)
  return label
}

export function updateLabel(id: string, name: string, color: string): Label | undefined {
  const idx = localLabels.findIndex((l) => l.id === id)
  if (idx === -1) return undefined
  localLabels[idx] = { ...localLabels[idx], name, color }
  return localLabels[idx]
}

export function deleteLabel(id: string): boolean {
  const idx = localLabels.findIndex((l) => l.id === id)
  if (idx === -1) return false
  localLabels.splice(idx, 1)
  return true
}

export function getLabelConversationCount(labelId: string): number {
  return MOCK_CONVERSATIONS.filter((c) => c.labels.some((l) => l.id === labelId)).length
}
