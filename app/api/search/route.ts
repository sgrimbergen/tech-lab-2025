import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

const openai = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: "2024-10-01-preview",
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_GPT_DEPLOYMENT
});

export async function POST(req: NextRequest) {
    const systemPrompt = `
    From this list, find the product that the user wants: [
        {
          "sku": 2001,
          "name": "Milka Alpenmilch 100g"
        },
        {
          "sku": 1346,
          "name": "Klinders Glühwein 1L"
        },
        {
          "sku": 1316,
          "name": "Klinders Himbeer-Eis 5L"
        },
        {
          "sku": 9509,
          "name": "Klinders Bananen-Eis 5L"
        },
        {
          "sku": 8486,
          "name": "Klinders Estragonsenf 1.2kg"
        },
        {
          "sku": 1319,
          "name": "Klinders Amarena-Dessertsauce 1kg"
        },
        {
          "sku": 1318,
          "name": "Jacobs Kaffee Kapseln 20 Stk."
        },
        {
          "sku": 7789,
          "name": "Rote Zwiebeln 2kg"
        },
        {
          "sku": 7790,
          "name": "Zitronen 1kg"
        },
        {
          "sku": 5059,
          "name": "Schnittlauch frisch 100g"
        },
        {
          "sku": 4471,
          "name": "Alnatura Haselnüsse 270g"
        },
        {
          "sku": 9036,
          "name": "Weizenmehl T700 glatt 1kg"
        },
        {
          "sku": 8808,
          "name": "Evian Mineralwasser, 1L Flasche"
        },
        {
          "sku": 4355,
          "name": "Lift Apfelschorle 1L"
        },
        {
          "sku": 4523,
          "name": "Heinz Tomatenketchup 500ml"
        },
        {
          "sku": 4525,
          "name": "Heinz Curry-Ketchup 500ml"
        },
        {
          "sku": 8196,
          "name": "Klinders Schlagrahm länger frisch 32% 1L"
        },
        {
          "sku": 8197,
          "name": "Klinders Naturjoghurt 3.6% 5kg"
        },
        {
          "sku": 8201,
          "name": "Cloudflight Gouda Scheiben 45% F.i.T. 1kg"
        },
        {
          "sku": 8213,
          "name": "Zuckermais Klinders 3kg"
        },
        {
          "sku": 8234,
          "name": "Cloudflight Tafelöl 10L"
        },
        {
          "sku": 8236,
          "name": "Klinders Sauerrahm 15% 5kg"
        },
        {
          "sku": 8240,
          "name": "Klinders Vollmilch länger frisch 3.5% 1L"
        },
        {
          "sku": 8273,
          "name": "Klinders Weizentoast 750g"
        },
        {
          "sku": 1479,
          "name": "Alpvital Bergbauern Sauerrahm 250g"
        },
        {
          "sku": 1487,
          "name": "Alpvital Heidelbeerjoghurt 3.2% 180g"
        },
        {
          "sku": 2605,
          "name": "Knorr Cremesupe 2.75kg"
        },
        {
          "sku": 3067,
          "name": "Dr. Oetker Ristorante Pizza Mozzarella glutenfrei TK 370g"
        },
        {
          "sku": 3761,
          "name": "Paprika tricolore 3kg"
        },
        {
          "sku": 4146,
          "name": "mehligkochende Kartoffeln, 2kg Sack"
        },
        {
          "sku": 4151,
          "name": "festkochende Kartoffeln, 2kg Sack"
        },
        {
          "sku": 4603,
          "name": "Rispentomaten Italien, 2kg"
        },
        {
          "sku": 4602,
          "name": "Schnitzel TK, 200g"
        },
        {
          "sku": 8274,
          "name": "Klinders Naturjoghurt 3.6% 10kg"
        },
        {
          "sku": 8295,
          "name": "Klinders Grana Padano gerieben 32% F.i.T. 1kg"
        },
        {
          "sku": 8297,
          "name": "Topfen 20% 5kg Klinders"
        },
        {
          "sku": 8310,
          "name": "Klinders Kidneybohnen rot 3/1"
        },
        {
          "sku": 8312,
          "name": "Klinders Schlagrahm länger frisch 36% 1L"
        },
        {
          "sku": 8313,
          "name": "Klinders Vollmilch länger frisch 3.5% 10L"
        },
        {
          "sku": 8330,
          "name": "Rote Rüben Streifen Klinders 5kg"
        },
        {
          "sku": 8331,
          "name": "Cloudflight Gouda 45% F.i.T. ca. 3kg"
        },
        {
          "sku": 8333,
          "name": "Klinders Grana Padano 32% F.i.T. ca. 1kg"
        },
        {
          "sku": 8334,
          "name": "Klinders Erdbeerjoghurt 3.2% 5kg"
        },
        {
          "sku": 8344,
          "name": "Kaisersemmel TK 30x70g Klinders"
        },
        {
          "sku": 8369,
          "name": "Klinders Vanille-Eis 5L"
        },
        {
          "sku": 8373,
          "name": "Fruchtjoghurt Waldbeer 5kg Klinders"
        },
        {
          "sku": 8374,
          "name": "Cloudflight Edamer Scheiben 45% F.i.T. 1kg"
        },
        {
          "sku": 8378,
          "name": "Klinders Holunderblütensirup 5.01L"
        },
        {
          "sku": 8381,
          "name": "Cloudflight Bacon geschnitten ca. 1kg"
        },
      ]
      The output should be a JSON serializable string! Like so: 
      [{"sku": 8381, "name": "Cloudflight Bacon geschnitten ca. 1kg"}]
      
      Only output the data, nothing else! Omit the "json" indication!
      Always use a list in case the user orders multiple products.
    `

    const { product } = await req.json();
    console.log("Request started")

    const response = await openai.chat.completions.create({
        model: process.env.AZURE_OPENAI_GPT_DEPLOYMENT ?? "",
        messages: [{ role: "system", content: systemPrompt }, ...product],
    });
    console.log(response)
    return NextResponse.json({ reply: response.choices[0].message.content });
}