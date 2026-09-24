const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const fallbackVerification = {
  overallStatus: 'warning',
  confidenceScore: 0,
  checkedItemsCount: 0,
  flagCount: 0,
  items: []
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const apiKey = Deno.env.get('OPENROUTER_API_KEY')
  if (!apiKey) return response({ error: 'OPENROUTER_API_KEY is not configured' }, 500)

  try {
    const input = await request.json()
    const scriptRule = input.language === 'Hindi'
      ? 'Use Devanagari script for all Hindi sentences. Do not output Tamil script or copy Tamil wording from the source note.'
      : input.language === 'Tamil'
      ? 'Use Tamil script for all Tamil sentences. Do not output Devanagari script or copy Hindi wording from the source note.'
      : input.language === 'English'
      ? 'Use English text only, except for medicine names, clinical abbreviations, and units.'
      : `Use the standard native script for ${input.language}. Do not copy wording from another language in the source note.`
    const prompt = `Create a safe patient discharge summary from this clinical note.
Return ONLY valid JSON with this shape:
{"condition":"string","originalFKGL":number,"simplifiedFKGL":number,"readabilityImprovementPct":number,"content":{"headlineSummary":"string","medicationGuide":[{"name":"string","dosage":"string","frequency":"string","purpose":"string","instructions":"string"}],"warningSignsWhenToCall":["string"],"followUpAppointments":[{"doctor":"string","timeframe":"string","purpose":"string"}],"dailyCareAndDiet":["string"]},"verification":{"overallStatus":"verified|warning|flagged","confidenceScore":number,"checkedItemsCount":number,"flagCount":number,"items":[{"id":"string","claim":"string","sourceQuote":"string","status":"verified|discrepancy|unsupported","explanation":"string"}]}}
Never invent medication names, dosages, appointments, diagnoses, or warning thresholds. If the note does not contain a value, use an empty list or explain that it was not provided. Translate every human-readable value in the JSON into ${input.language} only, including the condition, headlineSummary, medication frequency/purpose/instructions, diet and care bullets, follow-up fields, warning bullets, verification claims/source quotes/explanations, and any fallback text. For example, translate phrases such as "twice a day", "pain relief", "Take as directed", and "Avoid junk foods"; do not leave these values in English. ${scriptRule} Keep medicine names, clinical abbreviations, units, numbers, JSON property names, and status enum values unchanged when they are not translatable. Do not mix in English or any other language. Apply a ${input.literacyLevel} reading level. Include only the requested sections: ${JSON.stringify(input.sections)}.

Patient: ${JSON.stringify(input.patientInfo)}
Clinical note:
${input.clinicalNoteText}`

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://carebrief.ai',
        'X-Title': 'CareBrief AI'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are a clinical discharge instruction assistant. Preserve factual accuracy, never add unsupported medical facts, and obey the requested output language and script exactly. ${scriptRule}` },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    })

    if (!upstream.ok) return response({ error: `OpenRouter request failed: ${await upstream.text()}` }, 502)
    const completion = await upstream.json()
    const raw = completion.choices?.[0]?.message?.content
    if (!raw) return response({ error: 'OpenRouter returned no summary' }, 502)
    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''))
    return response({ ...parsed, verification: parsed.verification || fallbackVerification })
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : 'Summary generation failed' }, 500)
  }
})