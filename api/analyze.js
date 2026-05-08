/**
 * Vercel Serverless Function: /api/analyze
 * Calls Google Gemini 1.5 Flash Vision API
 *
 * Environment variable: GEMINI_API_KEY
 * Users can also pass their own key via userApiKey in the request body.
 */

const PROMPT = `You are FlipScan AI, an expert resale pricing assistant for the Canadian and US secondhand market.
Analyze the provided image and return ONLY a valid JSON object. No markdown, no backticks, no extra text whatsoever.

Return EXACTLY this JSON structure:
{
  "itemName": "Specific product name",
  "itemType": "Electronics|Furniture|Clothing|Collectibles|Tools|Books|Sports|Other",
  "brand": "Brand name or null",
  "model": "Model number or null",
  "condition": "Excellent|Good|Fair|Poor",
  "conditionNotes": "Brief visible condition note",
  "confidence": <integer 65-98>,
  "priceLow": <number CAD no symbol>,
  "priceAvg": <number CAD no symbol>,
  "priceHigh": <number CAD no symbol>,
  "demand": "slow|medium|fast",
  "timeToSell": "1-3 days|1-2 weeks|2-4 weeks|1+ month",
  "priceTrend": "rising|falling|stable",
  "platforms": ["Best platform", "Second", "Third"],
  "sellingTips": "One specific actionable selling tip",
  "suggestedTitle": "SEO listing title under 80 chars",
  "suggestedDescription": "Full marketplace listing 100-200 words, professional and compelling"
}

Platform options: "Facebook Marketplace", "eBay", "Kijiji", "Craigslist"
Prices in CAD. Be realistic. Condition: Excellent=like new, Good=normal wear, Fair=noticeable wear, Poor=damage.`

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64, mediaType, userApiKey } = req.body || {}

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' })
  }

  // Key priority: user-supplied > environment variable
  const apiKey = userApiKey || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'No API key configured. Add GEMINI_API_KEY to Vercel environment variables, or enter your own key in Settings.' })
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mediaType || 'image/jpeg',
                    data: imageBase64,
                  },
                },
                {
                  text: PROMPT,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}))
      const msg = err?.error?.message || `Gemini API error ${geminiRes.status}`
      if (geminiRes.status === 400 && msg.includes('API_KEY')) {
        return res.status(401).json({ error: 'Invalid Gemini API key.' })
      }
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'Rate limit reached. Please wait and try again.' })
      }
      return res.status(geminiRes.status).json({ error: msg })
    }

    const data = await geminiRes.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Strip markdown fences if model adds them
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      const match = cleaned.match(/\{[\s\S]+\}/)
      if (!match) {
        console.error('Raw Gemini response:', raw)
        return res.status(500).json({ error: 'Could not parse AI response. Try a clearer photo.' })
      }
      parsed = JSON.parse(match[0])
    }

    if (!parsed.itemName) {
      return res.status(500).json({ error: 'Incomplete AI response. Please try again.' })
    }

    return res.status(200).json(parsed)

  } catch (err) {
    console.error('FlipScan API error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
