'use client'

import { useState, useEffect } from 'react'
import { UserCog, Mail, Shield } from 'lucide-react'
import Image from 'next/image'
import { agentService } from '@/lib/services/agent-service'
import { COLORS } from '@/lib/constants'
import { AddAgentButton } from '@/components/features/agents/AddAgentButton'
import { EditAgentDialog } from '@/components/features/agents/EditAgentDialog'

interface Agent {
  id: string
  name: string
  email: string
  role: 'agent' | 'admin'
  avatar?: string
}

export const dynamic = 'force-dynamic'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      if (!response.ok) {
        throw new Error('Failed to load agents')
      }
      const data = await response.json()
      setAgents(data)
    } catch (e) {
      console.error('Error loading agents:', e)
      setError(e instanceof Error ? e.message : 'Failed to load agents')
    }
  }

  // Fetch agents on mount
  useEffect(() => {
    fetchAgents()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error Loading Agents</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-gray-600">Manage your support team members</p>
        </div>
        <AddAgentButton />
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No agents found. Add your first agent to get started.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(agent.name.toLowerCase())}`}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{agent.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {agent.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      agent.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {agent.role === 'admin' ? 'Administrator' : 'Support Agent'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-sm hover:text-primary-dark"
                      style={{ color: COLORS.primary }}
                      onClick={() => setEditingAgentId(agent.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditAgentDialog
        open={!!editingAgentId}
        onOpenChange={(open) => !open && setEditingAgentId(null)}
        agentId={editingAgentId || ''}
      />
    </div>
  )
} 