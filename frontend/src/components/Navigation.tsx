'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaTicketAlt, FaEnvelope, FaList, FaLink, FaFileAlt } from 'react-icons/fa';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      backgroundColor: 'var(--background-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '15px 0',
      marginBottom: '30px',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          🎫 Ticket Bot Dashboard
        </Link>

        <div style={{ display: 'flex', gap: '15px' }}>
          <Link
            href="/"
            className={`button ${isActive('/') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaHome /> Dashboard
          </Link>
          <Link
            href="/config"
            className={`button ${isActive('/config') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaCog /> Configuration
          </Link>
          <Link
            href="/tickets"
            className={`button ${isActive('/tickets') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaTicketAlt /> Tickets
          </Link>
          <Link
            href="/messages"
            className={`button ${isActive('/messages') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaEnvelope /> Messages
          </Link>
          <Link
            href="/menus"
            className={`button ${isActive('/menus') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaList /> Menus
          </Link>
          <Link
            href="/webhooks"
            className={`button ${isActive('/webhooks') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaLink /> Webhooks
          </Link>
          <Link
            href="/logs"
            className={`button ${isActive('/logs') ? 'button-primary' : 'button-secondary'}`}
          >
            <FaFileAlt /> Logs
          </Link>
        </div>
      </div>
    </nav>
  );
}
