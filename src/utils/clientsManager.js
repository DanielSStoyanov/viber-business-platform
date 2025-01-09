import { useState, useEffect } from 'react';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        // Replace this with your actual API call
        const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
        setClients(storedClients);

        // Extract unique tags
        const uniqueTags = [...new Set(
          storedClients.flatMap(client => client.tags || [])
        )];
        setTags(uniqueTags);
      } catch (err) {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  return { clients, tags, loading, error };
} 