import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [suite, setSuite] = useState('');
  const [score, setScore] = useState(null);
  const [comentario, setComentario] = useState('');

  const handleSubmit = async () => {
    if (!suite || score === null) {
      alert('Por favor, preencha o número da suíte e a nota.');
      return;
    }

    const { error } = await supabase.from('respostas_nps').insert([
      {
        suite,
        score,
        comentário: comentario
      }
    ]);

    if (error) {
      alert('Erro ao enviar. Tente novamente.');
    } else {
      alert('Resposta enviada com sucesso!');
      setSuite('');
      setScore(null);
      setComentario('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pesquisa de Satisfação</h1>
      <label>Número da suíte:</label>
      <input
        type="text"
        value={suite}
        onChange={(e) => setSuite(e.target.value)}
      />
      <p>De 0 a 10, o quanto você recomendaria o Cerro Azul Hotel Fazenda para um amigo ou familiar?</p>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setScore(i)}
            style={{
              backgroundColor: score === i ? '#0070f3' : '#eaeaea',
              color: score === i ? '#fff' : '#000',
              padding: 10
            }}
          >
            {i}
          </button>
        ))}
      </div>
      <br />
      <textarea
        placeholder="Observações e/ou elogios:"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        style={{ width: '100%', height: 100 }}
      />
      <br />
      <button onClick={handleSubmit} style={{ padding: 10, marginTop: 10 }}>
        Enviar resposta
      </button>
    </div>
  );
}
