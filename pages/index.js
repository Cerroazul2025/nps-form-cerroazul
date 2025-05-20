import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const coresNotas = [
  '#b91c1c', '#dc2626', '#f97316', '#fb923c', '#facc15',
  '#fde047', '#fef08a', '#a3e635', '#65a30d', '#4d7c0f', '#15803d'
]

export default function Home() {
  const [apartamento, setApartamento] = useState('')
  const [nota, setNota] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(false)
    setEnviado(false)

    if (apartamento.trim() === '' || nota === null) {
      setErro(true)
      return
    }

    const { error } = await supabase.from('respostas_nps').insert([
      {
        apartamento: apartamento,
        score: nota,
        comentario: comentario,
      },
    ])

    if (error) {
      setErro(true)
    } else {
      setEnviado(true)
      setApartamento('')
      setNota(null)
      setComentario('')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 600, margin: 'auto' }}>
      <img
        src="/Design sem nome (1).png"
        alt="Cerro Azul Hotel Fazenda"
        style={{ width: 200, display: 'block', margin: '0 auto 2rem auto' }}
      />
      <h2 style={{ textAlign: 'center' }}>Pesquisa de Satisfação</h2>
      <form onSubmit={handleSubmit}>
        <label>Número do apartamento:</label><br />
        <input
          type="text"
          value={apartamento}
          onChange={(e) => setApartamento(e.target.value)}
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
                padding: '0.7rem 1rem',
                backgroundColor: nota === num ? '#000' : coresNotas[num],
                color: nota === num ? '#fff' : '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
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
            cursor: 'pointer',
            fontWeight: 'bold'
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
