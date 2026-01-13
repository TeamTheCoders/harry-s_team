'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { TeamMemberForm } from '@/components/forms/TeamMemberForm';
import { TeamMember } from '@/types/team-member';
import { ColumnDef } from '@tanstack/react-table';

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members');
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.data || []);
        } else {
          console.error('Failed to fetch team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleAddTeamMember = () => {
    setEditingTeamMember(null);
    setShowForm(true);
  };

  const handleEditTeamMember = (teamMember: TeamMember) => {
    setEditingTeamMember(teamMember);
    setShowForm(true);
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
      } else {
        console.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      let response;
      const id = formData.get('id') as string | null;
      
      if (id) {
        // Update existing team member
        response = await fetch(`/api/team-members/${id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Create new team member
        response = await fetch('/api/team-members', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (id) {
          // Update the existing item in the list
          setTeamMembers(teamMembers.map(member => 
            member.id === id ? result.data : member
          ));
        } else {
          // Add the new item to the list
          setTeamMembers([...teamMembers, result.data]);
        }
        setShowForm(false);
      } else {
        console.error('Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeamMember(null);
  };

  // Define columns for the data table
  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <span>{row.original.isActive ? 'Yes' : 'No'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditTeamMember(row.original)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDeleteTeamMember(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members Management</h1>
        <Button onClick={handleAddTeamMember}>Add Team Member</Button>
      </div>

      {showForm ? (
        <TeamMemberForm
          initialData={editingTeamMember || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <DataTable columns={columns} data={teamMembers} />
      )}
    </div>
  );
}