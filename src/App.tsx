import { useState } from "react";

interface Idea {
  name: string;
  rice: { reach: number; impact: number; confidence: number; effort: number };
  kano: "basic" | "performance" | "excitement";
  moscow: "must" | "should" | "could" | "won't";
}

const kanoColor = {
  basic: "bg-gray-200 text-gray-800",
  performance: "bg-blue-200 text-blue-800",
  excitement: "bg-green-200 text-green-800",
};

const moscowColor = {
  must: "bg-red-200 text-red-800",
  should: "bg-orange-200 text-orange-800",
  could: "bg-yellow-200 text-yellow-800",
  "won't": "bg-gray-300 text-gray-700",
};

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<Idea>({
    name: "",
    rice: { reach: NaN, impact: NaN, confidence: NaN, effort: NaN },
    kano: "basic",
    moscow: "must",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const addIdea = () => {
    if (!newIdea.name.trim()) {
      setErrorMessage("Nama ide harus diisi.");
      return;
    }
    setErrorMessage("");
    setIdeas([...ideas, newIdea]);
    setNewIdea({
      name: "",
      rice: { reach: 0, impact: 0, confidence: 0, effort: 1 },
      kano: "basic",
      moscow: "must",
    });
  };

  const calcRICE = (idea: Idea) => {
    const { reach, impact, confidence, effort } = idea.rice;
    const effortInWeeks = effort / 7;
    return ((reach * impact * confidence) / effortInWeeks).toFixed(2);
  };

  const deleteIdea = (indexToDelete: number) => {
    setIdeas(ideas.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Evaluasi Ide Bisnis
      </h1>

      <div className="bg-white shadow p-6 rounded space-y-4 border">
        <div className="space-y-1">
          <input
            className={`border p-2 w-full rounded ${
              errorMessage ? "border-red-500" : ""
            }`}
            placeholder="Nama Ide Bisnis (misal: Integrasi REST API untuk Workflow)"
            value={newIdea.name}
            onChange={(e) => setNewIdea({ ...newIdea, name: e.target.value })}
          />
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              key: "reach",
              label: "Reach (cth: 100 user)",
              help: "Jumlah orang yang akan terkena dampak dari ide ini.",
            },
            {
              key: "impact",
              label: "Impact (0.25–3)",
              help: "0.25 = Rendah, 1 = Sedang, 3 = Tinggi",
            },
            {
              key: "confidence",
              label: "Confidence (%) 0–100",
              help: "Keyakinan kamu terhadap estimasi Reach & Impact.",
            },
            {
              key: "effort",
              label: "Effort (hari kerja)",
              help: "Estimasi waktu pengerjaan dalam hari kerja (misal 5 hari).",
            },
          ].map(({ key, label, help }) => (
            <div key={key} className="space-y-1">
              <input
                className="border p-2 rounded w-full"
                type="number"
                placeholder={label}
                min={key === "impact" ? "0.25" : key === "confidence" ? "0" : "1"}
                max={key === "confidence" ? "100" : undefined}
                step={key === "impact" ? "0.25" : "1"}
                value={
                  isNaN(newIdea.rice[key as keyof typeof newIdea.rice])
                    ? ""
                    : newIdea.rice[key as keyof typeof newIdea.rice]
                }
                onChange={(e) =>
                  setNewIdea({
                    ...newIdea,
                    rice: {
                      ...newIdea.rice,
                      [key]: e.target.value === "" ? NaN : +e.target.value,
                    },
                  })
                }
              />
              <p className="text-xs text-gray-500">{help}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="w-full md:flex-1 border p-2 rounded"
            value={newIdea.kano}
            onChange={(e) =>
              setNewIdea({ ...newIdea, kano: e.target.value as Idea["kano"] })
            }
          >
            <option value="basic">Kano: Basic (wajib)</option>
            <option value="performance">Kano: Performance (nilai tambah)</option>
            <option value="excitement">Kano: Excitement (wow factor)</option>
          </select>

          <select
            className="w-full md:flex-1 border p-2 rounded"
            value={newIdea.moscow}
            onChange={(e) =>
              setNewIdea({ ...newIdea, moscow: e.target.value as Idea["moscow"] })
            }
          >
            <option value="must">MoSCoW: Must Have</option>
            <option value="should">MoSCoW: Should Have</option>
            <option value="could">MoSCoW: Could Have</option>
            <option value="won't">MoSCoW: Won't Have</option>
          </select>

          <button
            onClick={addIdea}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded w-full md:w-auto md:px-6 whitespace-nowrap"
          >
            💡 Tambah Ide
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="p-4 rounded shadow border bg-white space-y-2 transition-transform hover:scale-[1.01] relative"
          >
            <button
              onClick={() => deleteIdea(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              title="Hapus Ide"
            >
              ❌
            </button>
            <h2 className="text-xl font-semibold">{idea.name}</h2>
            <p className="text-sm text-gray-600">
              RICE Score: <span className="font-bold">{calcRICE(idea)}</span>
            </p>

            <div className="flex gap-2">
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${kanoColor[idea.kano]}`}
              >
                Kano: {idea.kano}
              </span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${moscowColor[idea.moscow]}`}
              >
                MoSCoW: {idea.moscow}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
