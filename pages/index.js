import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [suíte, setSuíte] = useState('')
  const [nota, setNota] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(false)
    setEnviado(false)

    if (!nota || !suíte) {
      setErro(true)
      return
    }

    const { error } = await supabase.from('respostas_nps').insert([
      {
        suite: suíte,
        score: nota,
        comentario: comentario,
      },
    ])

    if (error) {
      setErro(true)
    } else {
      setEnviado(true)
      setSuíte('')
      setNota(null)
      setComentario('')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Pesquisa de Satisfação</h2>
      <form onSubmit={handleSubmit}>
        <label>Número da suíte:</label><br />
        <input
          type="text"
          value={suíte}
          onChange={(e) => setSuíte(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
        /><br />

        <label>De 0 a 10, o quanto você recomendaria o Cerro Azul Hotel Fazenda?</label><br />
        <div style={{ margin: '1rem 0' }}>
          {[...Array(11).keys()].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setNota(num)}
              style={{
                margin: '0.2rem',
                padding: '0.5rem 1rem',
                backgroundColor: nota === num ? '#0070f3' : '#e0e0e0',
                color: nota === num ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <label>Observações e/ou elogios:</label><br />
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows="4"
          style={{ width: '100%', padding: '0.5rem' }}
        ></textarea><br /><br />

        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar resposta
        </button>

        {enviado && <p style={{ color: 'green', marginTop: '1rem' }}>Obrigado pela sua resposta!</p>}
        {erro && <p style={{ color: 'red', marginTop: '1rem' }}>Erro ao enviar. Verifique os campos e tente novamente.</p>}
      </form>
    </div>
  )
}
