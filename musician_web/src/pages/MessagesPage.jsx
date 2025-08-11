import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessages } from '../context/MessagesContext';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * MessagesPage lists threads and shows a conversation view with compose box.
 */
export default function MessagesPage() {
  /** Messaging center for viewing threads and chatting with a selected partner. */
  const { partnerId } = useParams();
  const { threads, between, send, version } = useMessages();
  const { user } = useAuth();

  const items = useMemo(() => (partnerId ? between(partnerId) : []), [partnerId, version]); // eslint-disable-line

  const [text, setText] = useState('');
  const partner = partnerId ? getUserById(partnerId) : null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !partnerId) return;
    send({ toUserId: partnerId, text: text.trim() });
    setText('');
  };

  return (
    <div className="grid">
      <div className="section-title" style={{ gridColumn: 'span 12' }}>Messages</div>

      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="title">Your Threads</div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {threads().length === 0 ? (
            <div className="muted">No conversations yet.</div>
          ) : (
            threads().map((t) => {
              const u = getUserById(t.partnerId);
              return (
                <a key={t.partnerId} className="badge" href={`/messages/${t.partnerId}`}>
                  💬 {u?.name || 'Unknown'}
                </a>
              );
            })
          )}
        </div>
      </div>

      {partnerId && (
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="title">Chat with {partner?.name || 'Unknown'}</div>
          <div className="subtitle">{user?.name}</div>

          <div style={{
            marginTop: 12,
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'var(--surface-2)',
            padding: 10,
            maxHeight: 360,
            overflow: 'auto'
          }}>
            {items.map((m) => {
              const mine = m.fromUserId === user?.id;
              return (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: mine ? 'flex-end' : 'flex-start',
                  margin: '6px 0'
                }}>
                  <div style={{
                    background: mine ? 'var(--primary)' : 'var(--bg-soft)',
                    color: mine ? 'white' : 'var(--text)',
                    padding: '8px 10px',
                    borderRadius: 10,
                    maxWidth: 420
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            {items.length === 0 && <div className="muted">No messages yet. Say hello 👋</div>}
          </div>

          <form className="row" style={{ marginTop: 10 }} onSubmit={handleSend}>
            <input
              className="input"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Message text"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
