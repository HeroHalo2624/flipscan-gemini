/**
 * FlipScan AI — Image Analysis
 * Routes through Vercel serverless function /api/analyze
 * which calls Google Gemini Vision API server-side.
 * Users can also supply their own Gemini key stored in localStorage.
 */

export async function analyzeImage(imageFile, userApiKey) {
  const base64 = await fileToBase64(imageFile)
  const mediaType = imageFile.type || 'image/jpeg'

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: base64,
      mediaType,
      userApiKey: userApiKey || undefined,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    if (response.status === 401) throw new Error('Invalid API key. Please check your Gemini API key in Settings.')
    if (response.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.')
    if (response.status === 503) throw new Error('No API key configured. Add your Gemini API key in Settings or ask the app owner to set one up.')
    throw new Error(err?.error || `API error ${response.status}`)
  }

  const data = await response.json()
  if (!data.itemName) throw new Error('Incomplete AI response. Please try with a clearer photo.')
  return data
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}
