import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout/AdminLayout';
import crm from '../../../utils/crmApi';

const NewEnquiries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async()=>{ try { const { data } = await crm.get('/crm/leads', { params: { stage: 'New', limit: 50 } }); if (data.success) setItems(data.items||[]); } finally { setLoading(false); } })(); }, []);

  return (
    <AdminLayout>
      <div className="crm-container">
        <div className="crm-header">
          <h1>New Enquiries</h1>
          <p className="muted">Website and FAQ enquiries (latest 50)</p>
        </div>
        {loading ? (
          <div className="ph-banner" role="status">Loading…</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Interest</th>
                  <th>Source</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l)=> (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td>{l.mobile||''}</td>
                    <td>{l.email||''}</td>
                    <td>{l.courseInterest||''}</td>
                    <td>{l.source||''}</td>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {items.length===0 && (
                  <tr><td colSpan={6} className="muted">No enquiries</td></tr>
                )}
              </tbody>
            </table>
            <div style={{marginTop:12}}>
              <a className="btn" href="/admin/crm/leads">Open CRM Leads</a>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewEnquiries;
