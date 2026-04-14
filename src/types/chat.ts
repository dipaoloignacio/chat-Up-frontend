export type MessageStatus = 'sent' | 'received' | 'read'

export type Sender = {
    id: string
    name: string
    email: string
}

export type ChatMessage = {
    id: string
    groupId?: string
    receiverId?: string
    sender: Sender
    content: string
    createdAt: number
    status: MessageStatus
}

