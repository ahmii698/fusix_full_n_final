import { useState, useEffect } from "react";

// All tables
const TABLES = [
  "banners", "blog_posts", "company_info", "contact_messages",
  "cta_section", "faqs", "features", "hero_section", "newsletter_subscribers",
  "pages", "plan_purchases", "portfolio", "portfolio_technologies",
  "pricing_features", "pricing_plans", "process_steps", "services",
  "service_features", "statistics", "team_members", "technologies", "testimonials", "users", "appointments"
];

const API_URL = 'http://localhost:8001/backend/admin.php';

export default function SimpleAdminPanel() {
  const [activeTable, setActiveTable] = useState(TABLES[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newRecord, setNewRecord] = useState<any>({});
  const [message, setMessage] = useState<{text: string, type: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${activeTable}`);
      const result = await response.json();
      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }
    } catch (error) {
      showMessage("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try {
      await fetch(`${API_URL}/${activeTable}/${id}`, { method: 'DELETE' });
      showMessage("Record deleted", "success");
      fetchData();
    } catch {
      showMessage("Delete failed", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingRow) return;
    try {
      await fetch(`${API_URL}/${activeTable}/${editingRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRow)
      });
      setEditingRow(null);
      showMessage("Record updated", "success");
      fetchData();
    } catch {
      showMessage("Update failed", "error");
    }
  };

  const handleCreate = async () => {
    try {
      await fetch(`${API_URL}/${activeTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      setAddingNew(false);
      setNewRecord({});
      showMessage("Record created", "success");
      fetchData();
    } catch {
      showMessage("Create failed", "error");
    }
  };

  const formatLabel = (key: string) => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0a" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#111", borderRight: "1px solid #222", overflowY: "auto", padding: "20px" }}>
        <h2 style={{ color: "#FFD700", marginBottom: "20px", fontSize: "20px" }}>Admin Panel</h2>
        {TABLES.map(table => (
          <div key={table} onClick={() => setActiveTable(table)} style={{
            padding: "10px 12px", marginBottom: "4px", borderRadius: "8px", cursor: "pointer",
            background: activeTable === table ? "#667eea" : "transparent",
            color: activeTable === table ? "#fff" : "#888",
            fontWeight: activeTable === table ? "600" : "400"
          }}>
            {formatLabel(table)}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ color: "#fff", margin: 0 }}>{formatLabel(activeTable)}</h1>
            <p style={{ color: "#666", marginTop: "4px" }}>Manage {activeTable} records</p>
          </div>
          <button onClick={() => { setAddingNew(true); setNewRecord({}); }} style={{
            padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer"
          }}>+ Add New Record</button>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px 20px", borderRadius: "8px", marginBottom: "20px",
            background: message.type === 'success' ? "#4caf50" : "#f44336", color: "#fff"
          }}>{message.text}</div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading...</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>No records found</div>
        ) : (
          <div style={{ overflowX: "auto", background: "#111", borderRadius: "12px", border: "1px solid #222" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1a1a1a", borderBottom: "1px solid #333" }}>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: "12px", fontWeight: "500" }}>
                      {formatLabel(key)}
                    </th>
                  ))}
                  <th style={{ padding: "12px", textAlign: "center", color: "#888", fontSize: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #222" }}>
                    {Object.entries(row).map(([key, val]) => (
                      <td key={key} style={{ padding: "12px", color: "#ddd", fontSize: "13px" }}>
                        {key.includes('image') || key.includes('photo') ? (
                          val ? <img src={val as string} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} /> : '-'
                        ) : (
                          String(val).substring(0, 50)
                        )}
                      </td>
                    ))}
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button onClick={() => setEditingRow(row)} style={{ padding: "6px 12px", marginRight: "8px", background: "#1a1a1a", color: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDelete(row.id)} style={{ padding: "6px 12px", background: "transparent", color: "#ff6b6b", border: "1px solid #ff6b6b", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRow && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setEditingRow(null)}>
          <div style={{ background: "#1a1a1a", padding: "24px", borderRadius: "12px", width: "500px", maxWidth: "90%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>Edit Record</h3>
            {Object.keys(editingRow).map(key => {
              if (key === 'id' || key === 'created_at' || key === 'updated_at') return null;
              return (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", marginBottom: "4px", color: "#888", fontSize: "12px" }}>{formatLabel(key)}</label>
                  <input type="text" value={editingRow[key] || ''} onChange={e => setEditingRow({ ...editingRow, [key]: e.target.value })} style={{ width: "100%", padding: "8px 12px", background: "#111", border: "1px solid #333", borderRadius: "6px", color: "#fff" }} />
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setEditingRow(null)} style={{ padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUpdate} style={{ padding: "8px 16px", background: "#667eea", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addingNew && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setAddingNew(false)}>
          <div style={{ background: "#1a1a1a", padding: "24px", borderRadius: "12px", width: "500px", maxWidth: "90%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>Add New Record</h3>
            {data[0] && Object.keys(data[0]).map(key => {
              if (key === 'id' || key === 'created_at' || key === 'updated_at') return null;
              return (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", marginBottom: "4px", color: "#888", fontSize: "12px" }}>{formatLabel(key)}</label>
                  <input type="text" value={newRecord[key] || ''} onChange={e => setNewRecord({ ...newRecord, [key]: e.target.value })} style={{ width: "100%", padding: "8px 12px", background: "#111", border: "1px solid #333", borderRadius: "6px", color: "#fff" }} />
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setAddingNew(false)} style={{ padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} style={{ padding: "8px 16px", background: "#667eea", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}