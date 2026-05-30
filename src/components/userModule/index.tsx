import React, { useState, useEffect } from 'react';
import { User } from '../../types/user.types';

// Versión simplificada para que funcione
export const UserModule: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Temporal - luego conectarás con API real
    setUsers([]);
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div>
      <h2>Módulo de Usuarios</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id}>
            <img src={user.avatar_url} alt={user.nombre} width={50} />
            <span>{user.nombre}</span>
            <span>{user.quiniela_enviada ? '✅ Quiniela enviada' : '⏳ Pendiente'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};