import { NextRequest, NextResponse } from "next/server";

interface AnalysisResult {
  title: string;
  latin: string;
  category: string;
  condition: string;
  suggestedPrice: number;
  description: string;
  tags: string[];
  followUpQuestions: { id: string; question: string; options?: string[] }[];
  confidence: number;
}

const DEMO_RESULTS: AnalysisResult[] = [
  {
    title: "Euphyllia paradivisa – Torch Coral",
    latin: "Euphyllia paradivisa",
    category: "Korallen",
    condition: "Nachzucht",
    suggestedPrice: 45,
    description:
      "Wunderschöner Torch Coral aus eigener Nachzucht. Kräftige Tentakel mit leuchtenden Spitzen, ideal für Riffaquarien ab 200L. Verträglich mit den meisten LPS-Korallen.",
    tags: ["LPS", "Torch Coral", "Euphyllia", "Nachzucht"],
    followUpQuestions: [
      {
        id: "size",
        question: "Wie gross ist der Ableger?",
        options: ["1-2 Köpfe", "3-5 Köpfe", "6+ Köpfe", "Mutterstück"],
      },
      {
        id: "color",
        question: "Welche Farbvariante?",
        options: ["Gold-Tip", "Green Tip", "Ultra Purple", "Standard"],
      },
    ],
    confidence: 0.91,
  },
  {
    title: "Acropora millepora – SPS Koralle",
    latin: "Acropora millepora",
    category: "Korallen",
    condition: "Nachzucht",
    suggestedPrice: 35,
    description:
      "Acropora millepora Ableger aus stabiler SPS-Zucht. Intensive Farbe, gute Verzweigung. Benötigt starke Strömung und hohes Licht (PAR 250+).",
    tags: ["SPS", "Acropora", "Nachzucht", "High Light"],
    followUpQuestions: [
      {
        id: "size",
        question: "Grösse des Frags?",
        options: ["~2cm", "~4cm", "~6cm", "~8cm+"],
      },
      {
        id: "color",
        question: "Hauptfarbe?",
        options: ["Grün", "Blau-Violett", "Pink", "Braun mit Farbe"],
      },
    ],
    confidence: 0.87,
  },
  {
    title: "Zoanthus – Zoanthiden Kolonien",
    latin: "Zoanthus sp.",
    category: "Korallen",
    condition: "Nachzucht",
    suggestedPrice: 25,
    description:
      "Farbenfrohe Zoanthiden-Kolonie. Sehr pflegeleicht, wächst schnell und eignet sich perfekt für Einsteiger-Riffaquarien. Starke Ausbreiter.",
    tags: ["Zoanthiden", "Zoanthus", "LPS", "Einsteiger"],
    followUpQuestions: [
      {
        id: "polyps",
        question: "Anzahl Polypen auf dem Stein?",
        options: ["5-10", "11-20", "21-50", "50+"],
      },
      {
        id: "morph",
        question: "Bekannte Morph-Bezeichnung?",
        options: ["Unbekannt", "Eagle Eye", "Utter Chaos", "Fruit Loop", "Andere"],
      },
    ],
    confidence: 0.88,
  },
  {
    title: "Amphiprion ocellaris – Clownfisch",
    latin: "Amphiprion ocellaris",
    category: "Fische",
    condition: "Nachzucht",
    suggestedPrice: 28,
    description:
      "Klassischer Clownfisch aus Nachzucht. Gesund, frisst alles, gewöhnt an Aquarienbedingungen. Ideal für Anfänger und als Pärchen oder Gruppe haltbar.",
    tags: ["Clownfisch", "Amphiprion", "Nachzucht", "Anfänger"],
    followUpQuestions: [
      {
        id: "quantity",
        question: "Wie viele Tiere?",
        options: ["1 Einzeltier", "Pärchen (2)", "3 Tiere", "Gruppe (4+)"],
      },
      {
        id: "size",
        question: "Grösse?",
        options: ["Juvenil (~2cm)", "Mittel (~4cm)", "Adult (~6cm+)"],
      },
    ],
    confidence: 0.93,
  },
];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Kein Bild hochgeladen" }, { status: 400 });
  }

  // Try real AI analysis if API key is available
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mediaType = (file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp") || "image/jpeg";

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              {
                type: "text",
                text: `Du bist ein Experte für Meerwasseraquaristik. Analysiere dieses Bild und gib eine JSON-Antwort zurück.

Identifiziere das Tier/die Koralle und antworte NUR mit validem JSON (kein Markdown, keine Erklärungen):
{
  "title": "Deutscher Name – Kurzbezeichnung",
  "latin": "Lateinischer Artname",
  "category": "Korallen|Fische|Wirbellose|Equipment",
  "condition": "Nachzucht|Wildfang|Gebraucht|Neu",
  "suggestedPrice": <Zahl in CHF, realistisch für Schweizer Markt>,
  "description": "2-3 Sätze Beschreibung auf Deutsch, ideal für ein Inserat",
  "tags": ["tag1", "tag2", "tag3"],
  "followUpQuestions": [
    {
      "id": "size",
      "question": "Frage zur Grösse oder Menge?",
      "options": ["Option 1", "Option 2", "Option 3"]
    },
    {
      "id": "color",
      "question": "Frage zur Farbvariante oder Qualität?",
      "options": ["Option 1", "Option 2", "Option 3"]
    }
  ],
  "confidence": <0.0-1.0>
}

Falls das Bild kein Aquariertier/Equipment zeigt, antworte mit confidence: 0.1 und sinnvollen Platzhaltern.`,
              },
            ],
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const result: AnalysisResult = JSON.parse(text);
      return NextResponse.json(result);
    } catch (err) {
      console.error("Anthropic API error, using demo fallback:", err);
    }
  }

  // Demo fallback – pick a random result based on filename hint
  const name = file.name.toLowerCase();
  let result = DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)];

  if (name.includes("clown") || name.includes("fisch") || name.includes("fish")) {
    result = DEMO_RESULTS[3];
  } else if (name.includes("acro") || name.includes("sps")) {
    result = DEMO_RESULTS[1];
  } else if (name.includes("zoo") || name.includes("zoa")) {
    result = DEMO_RESULTS[2];
  } else if (name.includes("torch") || name.includes("euphyllia")) {
    result = DEMO_RESULTS[0];
  }

  // Simulate analysis delay for realism
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json(result);
}
