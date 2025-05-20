import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [score, setScore] = useState(null);
  const [comentario, setComentario] = useState("");
  const [suite, setSuite] = useState("");

  const enviarResposta = async () => {
    if (!score || !suite) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const { data, error } = await supabase.from("respostas_nps").insert([
      {
        score,
        comentário: comentario,
        suite,
      },
    ]);

    if (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar. Tente novamente.");
    } else {
      alert("Resposta enviada com sucesso!");
      setScore(null);
      setComentario("");
      setSuite("");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Pesquisa de Satisfação</h2>

      <label>
        Número da Suíte: <br />
        <input
          type="text"
          value={suite}
          onChange={(e) => setSuite(e.target.value)}
          required
        />
      </label>

      <div style={{ marginTop: "1rem" }}>
        <p>De 0 a 10, quanto você recomendaria o hotel a um amigo?</p>
        {[...Array(11).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setScore(num)}
            style={{
              margin: "2px",
              background: score === num ? "green" : "#eee",
              padding: "8px",
            }}
          >
            {num}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Observações / elogios:
          <br />
          <textarea
            rows="4"
            cols="40"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </label>
      </div>

      <br />
      <button
        onClick={enviarResposta}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "green",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Enviar resposta
      </button>
    </div>
  );
}

