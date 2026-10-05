// src/components/admin/AdminTables.tsx (Updated)
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../../config';

interface Props {
  table: string;
}

interface Record {
  id: number;
  [key: string]: any;
}

export default function AdminTables({ table }: Props) {
  const [data, setData] = useState<Record[]>([]);
  const [editingRow, setEditingRow] = useState<Record | null>(null);
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<Partial<Record>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [uploadingImage, setUploadingImage] = useState<{field: string, isNew: boolean} | null>(null);

  // Email Modal States
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [selectedEmailRecord, setSelectedEmailRecord] = useState<Record | null>(null);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    status: ''
  });
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  // ✅ API URL
  const API_URL = `${API_URL}`; // Same as NewAdminPanel
  const getToken = () => localStorage.getItem('adminToken');

  const loadData = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/admin/${table}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      setData(result.data || result || []);
    } catch (error: any) {
      showNotification("Failed to load data!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [table]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ IMAGE UPLOAD FUNCTION
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/upload.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        return result.url;
      }
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isNew: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage({ field, isNew });
    
    const imageUrl = await uploadImage(file);
    
    if (imageUrl) {
      if (isNew) {
        setNewRecord({
          ...newRecord,
          [field]: imageUrl
        });
      } else if (editingRow) {
        setEditingRow({
          ...editingRow,
          [field]: imageUrl
        });
      }
      showNotification("Image uploaded successfully!", "success");
    } else {
      showNotification("Image upload failed!", "error");
    }
    
    setUploadingImage(null);
  };

  const remove = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const token = getToken();
      await fetch(`${API_URL}/admin/${table}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await loadData();
      showNotification("Record deleted successfully!", "success");
    } catch (error: any) {
      showNotification("Delete failed!", "error");
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editingRow) return;
    
    try {
      const token = getToken();
      await fetch(`${API_URL}/admin/${table}/${editingRow.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingRow)
      });
      
      setEditingRow(null);
      await loadData();
      showNotification("Record updated successfully!", "success");
    } catch (error: any) {
      showNotification("Update failed!", "error");
    }
  };

  const handleCreate = async (): Promise<void> => {
    try {
      const token = getToken();
      await fetch(`${API_URL}/admin/${table}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecord)
      });
      
      setAddingNew(false);
      setNewRecord({});
      await loadData();
      showNotification("Record created successfully!", "success");
    } catch (error: any) {
      showNotification("Create failed!", "error");
    }
  };

  const handleInputChange = (key: string, value: string, isNew: boolean = false): void => {
    if (isNew) {
      setNewRecord({
        ...newRecord,
        [key]: value
      });
    } else if (editingRow) {
      setEditingRow({
        ...editingRow,
        [key]: value
      });
    }
  };

  // ✅ FIXED: Email Send Function - Same as NewAdminPanel
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmailRecord) return;
    
    setSendingEmail(true);
    
    try {
      // Get customer email and name
      const customerEmail = selectedEmailRecord.email || selectedEmailRecord.customer_email;
      const customerName = selectedEmailRecord.full_name || selectedEmailRecord.name || selectedEmailRecord.customer_name || 'Customer';
      
      // Prepare email data matching NewAdminPanel format
      const emailPayload = {
        name: customerName,
        email: customerEmail,
        message: emailData.message,
        subject: emailData.subject
      };
      
      console.log('Sending email:', emailPayload);
      
      const response = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });
      
      const result = await response.json();
      console.log('Email response:', result);
      
      if (result.success) {
        showNotification(`✅ Email sent successfully to ${customerEmail}`, "success");
        
        // Update status if changed
        if (emailData.status && emailData.status !== selectedEmailRecord.status) {
          // Update status in database
          try {
            const token = getToken();
            await fetch(`${API_URL}/admin/${table}/${selectedEmailRecord.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ...selectedEmailRecord, status: emailData.status })
            });
            await loadData();
          } catch (error) {
            console.error('Status update failed:', error);
          }
        }
        
        // Close modal and reset form
        setShowEmailModal(false);
        setSelectedEmailRecord(null);
        setEmailData({ subject: '', message: '', status: '' });
      } else {
        showNotification(`❌ Failed: ${result.error || 'Unknown error'}`, "error");
      }
    } catch (error: any) {
      console.error('Email send error:', error);
      showNotification(`❌ Failed to send email: ${error.message}`, "error");
    } finally {
      setSendingEmail(false);
    }
  };

  // Open Email Modal
  const openEmailModal = (record: Record) => {
    setSelectedEmailRecord(record);
    
    // Set email subject based on table type
    let subject = '';
    let status = record.status || 'pending';
    
    const customerName = record.full_name || record.name || record.customer_name || 'Customer';
    
    if (table === 'appointments') {
      subject = `Regarding your appointment on ${record.appointment_date || 'scheduled date'}`;
    } else if (table === 'plan_purchases') {
      const planName = record.plan_name || record.plan || 'selected plan';
      subject = `Regarding your ${planName} plan purchase inquiry`;
    } else {
      subject = `Regarding your inquiry`;
    }
    
    setEmailData({
      subject: subject,
      message: `Dear ${customerName},\n\n`,
      status: status
    });
    setShowEmailModal(true);
  };

  const formatKey = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getColumnType = (key: string, value: any): string => {
    if (key.includes('image') || key.includes('img') || key.includes('photo') || key.includes('icon')) return 'image';
    if (key.includes('date') || key.includes('created_at') || key.includes('updated_at')) return 'datetime-local';
    if (key.includes('email')) return 'email';
    if (key.includes('password')) return 'password';
    if (key.includes('url') || key.includes('link')) return 'url';
    if (key.includes('phone') || key.includes('mobile')) return 'tel';
    if (key.includes('order') || key.includes('sort')) return 'number';
    if (typeof value === 'number') return 'number';
    return 'text';
  };

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
  };

  const bulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} records?`)) return;
    
    try {
      const token = getToken();
      await Promise.all(selectedRows.map(id => 
        fetch(`${API_URL}/admin/${table}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
      
      setSelectedRows([]);
      await loadData();
      showNotification(`${selectedRows.length} records deleted successfully!`, "success");
    } catch (error: any) {
      showNotification("Bulk delete failed!", "error");
    }
  };

  const hasEmailField = (row: Record): boolean => {
    return !!(row.email || row.customer_email);
  };

  const getCustomerName = (row: Record): string => {
    return row.full_name || row.name || row.customer_name || row.customer || 'Customer';
  };

  const getCustomerEmail = (row: Record): string => {
    return row.email || row.customer_email || '';
  };

  const isEmailTable = (): boolean => {
    return table === 'appointments' || table === 'plan_purchases';
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          padding: "14px 28px",
          background: notification.type === 'success' 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          borderRadius: '50px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 2000,
          animation: 'slideIn 0.3s ease',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{notification.type === 'success' ? '✅' : '❌'}</span>
          {notification.message}
        </div>
      )}

      {/* Email Modal */}
      {isEmailTable() && showEmailModal && selectedEmailRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)"
          }}
          onClick={() => setShowEmailModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              width: "600px",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              animation: "slideUp 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "22px", fontWeight: "600" }}>
                📧 Send Email to {getCustomerName(selectedEmailRecord)}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#64748b",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e2e8f0"
            }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>📧 Email:</strong> {getCustomerEmail(selectedEmailRecord)}
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>📞 Phone:</strong> {selectedEmailRecord.phone || selectedEmailRecord.customer_phone || '-'}
              </p>
              {table === 'appointments' && (
                <p style={{ margin: "0", fontSize: "14px" }}>
                  <strong>📅 Appointment:</strong> {selectedEmailRecord.appointment_date} at {selectedEmailRecord.appointment_time}
                </p>
              )}
              {table === 'plan_purchases' && (
                <p style={{ margin: "0", fontSize: "14px" }}>
                  <strong>💰 Plan:</strong> {selectedEmailRecord.plan_name || selectedEmailRecord.plan || 'N/A'}
                </p>
              )}
            </div>

            <form onSubmit={handleSendEmail}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "500", fontSize: "14px" }}>
                  Subject *
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "500", fontSize: "14px" }}>
                  Message *
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  required
                  placeholder="Type your response here..."
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "500", fontSize: "14px" }}>
                  Update Status (Optional)
                </label>
                <select
                  value={emailData.status}
                  onChange={(e) => setEmailData({...emailData, status: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "white",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="">Keep Current Status</option>
                  {table === 'appointments' ? (
                    <>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="cancelled">❌ Cancelled</option>
                      <option value="completed">✔️ Completed</option>
                    </>
                  ) : (
                    <>
                      <option value="processing">⏳ Processing</option>
                      <option value="completed">✅ Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </>
                  )}
                </select>
              </div>

              <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    padding: "12px 24px",
                    background: "white",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  style={{
                    padding: "12px 32px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: sendingEmail ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 10px 20px -5px rgba(59,130,246,0.3)",
                    opacity: sendingEmail ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!sendingEmail) e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {sendingEmail ? '📧 Sending...' : '📧 Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '300px',
                padding: '12px 16px 12px 48px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '13px',
              color: '#94a3b8',
              fontSize: '16px'
            }}>🔍</span>
          </div>

          <button
            onClick={loadData}
            style={{
              padding: '12px 24px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            🔄 Refresh
          </button>

          {selectedRows.length > 0 && (
            <button
              onClick={bulkDelete}
              style={{
                padding: '12px 24px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
            >
              🗑️ Delete Selected ({selectedRows.length})
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setAddingNew(true);
            if (data[0]) {
              const emptyRecord: Partial<Record> = {};
              Object.keys(data[0]).forEach(key => {
                if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                  emptyRecord[key] = '';
                }
              });
              setNewRecord(emptyRecord);
            }
          }}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 20px -5px rgba(59,130,246,0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '20px' }}>+</span> Add New Record
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "80px",
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            display: "inline-block",
            width: "48px",
            height: "48px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ marginTop: "20px", color: "#64748b" }}>Loading data...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}>
          {filteredData.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "100px",
              color: "#64748b"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
              <h3 style={{ color: "#1e293b", marginBottom: "8px", fontSize: "20px" }}>No Records Found</h3>
              <p style={{ marginBottom: "24px" }}>
                {searchTerm ? "No matching records found." : "This table is empty."}
              </p>
              <button
                onClick={() => setAddingNew(true)}
                style={{
                  padding: "12px 32px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                + Add Your First Record
              </button>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "16px", width: "40px" }}>
                        <input
                          type="checkbox"
                          checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                          onChange={toggleAllRows}
                          style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                      </th>
                      {data[0] && Object.keys(data[0]).map((key) => (
                        <th 
                          key={key}
                          style={{ 
                            padding: "16px",
                            textAlign: "left",
                            color: "#475569",
                            fontWeight: "600",
                            fontSize: "13px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}
                        >
                          {formatKey(key)}
                        </th>
                      ))}
                      <th style={{ 
                        padding: "16px",
                        textAlign: "center",
                        color: "#475569",
                        fontWeight: "600",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        width: isEmailTable() ? "280px" : "200px"
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr 
                        key={row.id}
                        style={{ 
                          borderBottom: "1px solid #e2e8f0",
                          background: selectedRows.includes(row.id) 
                            ? '#eff6ff' 
                            : (index % 2 === 0 ? "white" : "#fafbfc"),
                          transition: "background 0.2s"
                        }}
                      >
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRowSelection(row.id)}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </td>
                        {Object.entries(row).map(([key, val], i) => {
                          const isImage = key.includes('image') || key.includes('img') || key.includes('photo') || key.includes('icon');
                          
                          return (
                            <td 
                              key={i}
                              style={{ 
                                padding: "16px",
                                color: "#1e293b"
                              }}
                            >
                              {isImage && val ? (
                                val.startsWith('http') || val.startsWith('/') ? (
                                  <img 
                                    src={val} 
                                    alt={key}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      border: "1px solid #e2e8f0"
                                    }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span style={{ fontSize: "32px" }}>{val}</span>
                                )
                              ) : (
                                <span title={String(val)}>
                                  {val !== null && val !== undefined 
                                    ? (typeof val === 'boolean' 
                                      ? (val ? '✓' : '✗') 
                                      : String(val).substring(0, 100))
                                    : '-'}
                                  {String(val).length > 100 && '...'}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                            {/* Email Button - Works for Appointments AND Plan Purchases */}
                            {hasEmailField(row) && (
                              <button
                                onClick={() => openEmailModal(row)}
                                style={{
                                  padding: "8px 16px",
                                  background: "#8b5cf6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#7c3aed"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#8b5cf6"}
                              >
                                📧 Email Reply
                              </button>
                            )}
                            <button
                              onClick={() => setEditingRow(row)}
                              style={{
                                padding: "8px 20px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => remove(row.id)}
                              style={{
                                padding: "8px 20px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  padding: "24px",
                  borderTop: "1px solid #e2e8f0"
                }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      background: currentPage === 1 ? "#f1f5f9" : "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      color: currentPage === 1 ? "#94a3b8" : "#0f172a",
                      fontSize: "14px"
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: "0 16px", color: "#475569" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 16px",
                      background: currentPage === totalPages ? "#f1f5f9" : "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      color: currentPage === totalPages ? "#94a3b8" : "#0f172a",
                      fontSize: "14px"
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Edit Modal with Image Upload */}
      {editingRow && (
        <Modal
          title="Edit Record"
          onClose={() => setEditingRow(null)}
          onSubmit={handleUpdate}
          submitText="Update Changes"
        >
          {Object.keys(editingRow).map((key) => {
            if (key === "id" || key === "created_at" || key === "updated_at") return null;
            const isImage = key.includes('image') || key.includes('img') || key.includes('photo') || key.includes('icon');

            return (
              <FormField
                key={key}
                label={formatKey(key)}
                type={getColumnType(key, editingRow[key])}
                value={editingRow[key]}
                onChange={(value) => handleInputChange(key, value, false)}
                isImage={isImage}
                onImageUpload={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file);
                      if (url) {
                        handleInputChange(key, url, false);
                      }
                    }
                  };
                  input.click();
                }}
                uploading={uploadingImage?.field === key && !uploadingImage?.isNew}
              />
            );
          })}
        </Modal>
      )}

      {/* Add New Modal with Image Upload */}
      {addingNew && (
        <Modal
          title={`Add New ${formatKey(table)} Record`}
          onClose={() => {
            setAddingNew(false);
            setNewRecord({});
          }}
          onSubmit={handleCreate}
          submitText="Create Record"
        >
          {Object.keys(newRecord).map((key) => {
            const isImage = key.includes('image') || key.includes('img') || key.includes('photo') || key.includes('icon');
            
            return (
              <FormField
                key={key}
                label={formatKey(key)}
                type={getColumnType(key, newRecord[key])}
                value={newRecord[key]}
                onChange={(value) => handleInputChange(key, value, true)}
                isImage={isImage}
                onImageUpload={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file);
                      if (url) {
                        handleInputChange(key, url, true);
                      }
                    }
                  };
                  input.click();
                }}
                uploading={uploadingImage?.field === key && uploadingImage?.isNew}
              />
            );
          })}
        </Modal>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ==================== MODAL COMPONENT ====================
const Modal = ({ title, children, onClose, onSubmit, submitText }: any) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(8px)"
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "white",
        padding: "32px",
        width: "550px",
        maxHeight: "85vh",
        overflowY: "auto",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        animation: "slideUp 0.3s ease"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "22px", fontWeight: "600" }}>
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#64748b",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          ✕
        </button>
      </div>

      {children}

      <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          onClick={onClose}
          style={{
            padding: "12px 24px",
            background: "white",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s",
            boxShadow: "0 10px 20px -5px rgba(59,130,246,0.3)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          {submitText}
        </button>
      </div>
    </div>
  </div>
);

// ==================== FORM FIELD COMPONENT ====================
const FormField = ({ label, type, value, onChange, isImage, onImageUpload, uploading }: any) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={{ 
      display: "block", 
      marginBottom: "8px",
      color: "#475569",
      fontWeight: "500",
      fontSize: "14px"
    }}>
      {label}
    </label>

    {isImage ? (
      <div>
        {value && (
          <div style={{ marginBottom: "12px" }}>
            {value.startsWith('http') || value.startsWith('/') ? (
              <img 
                src={value} 
                alt={label}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0"
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span style={{ fontSize: "48px" }}>{value}</span>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => onImageUpload()}
          disabled={uploading}
          style={{
            padding: "10px 20px",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "13px",
            fontWeight: "500",
            color: "#475569",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!uploading) e.currentTarget.style.background = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
          }}
        >
          {uploading ? '⏳ Uploading...' : (value ? '🖼️ Change Image' : '📤 Upload Image')}
        </button>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL"
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            outline: "none"
          }}
        />
      </div>
    ) : type === 'boolean' ? (
      <select
        value={value ? "true" : "false"}
        onChange={(e) => onChange(e.target.value === "true")}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          fontSize: "14px",
          outline: "none",
          backgroundColor: "white",
          transition: "all 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          resize: "vertical",
          transition: "all 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          fontSize: "14px",
          outline: "none",
          transition: "all 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
      />
    )}
  </div>
);