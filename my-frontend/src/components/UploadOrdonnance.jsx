import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

function UploadOrdonnance({ onMedicamentsExtracted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // on utilise Tesseract pour récupérer les lignes du fichier
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });

      // test pour voir si le texte est bien extrait
      const extractedText = result.data.text;
      console.log('Texte extrait :', extractedText);

      // on envoie le texte extrait par Tesseract dans le back pour qu'il l'analyse
      const response = await axios.post('/api/ordonnance/process', { text: extractedText });
      onMedicamentsExtracted(response.data.medicaments);
    } catch (err) {
      setError('Erreur lors de l’analyse de l’ordonnance.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Rentrez votre fichier fournisseur ci-dessous</h2>
      <input type="file" accept=".jpg,.png" onChange={handleFileUpload} />
      {loading && <p>Analyse en cours...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UploadOrdonnance;
