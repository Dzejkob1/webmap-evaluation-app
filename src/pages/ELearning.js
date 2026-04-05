import { Link } from "react-router-dom";

export default function ELearning() {
  return (
    <div>
      <h2>E-learning stránka</h2>
      <p>Zde bude obsah e-learningu...</p>
       <div className="back-home">
        <Link to="/" className="back-button">
          ⬅️ Zpět na úvodní stránku
        </Link>
      </div>
    </div>
  );
}