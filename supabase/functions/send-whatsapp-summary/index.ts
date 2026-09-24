const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function normalizeWhatsappNumber(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return null
  if (trimmed.startsWith('+')) return `+${digits}`
  return `+${digits}`
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const twilioSid = Deno.env.get('TWILIO_SID')
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const twilioWhatsappFrom = Deno.env.get('TWILIO_WHATSAPP_FROM')

  if (!twilioSid || !twilioAuthToken || !twilioWhatsappFrom) {
    return response({ error: 'Twilio WhatsApp credentials are not configured on the backend.' }, 500)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return response({ error: 'Backend summary validation is not configured.' }, 500)
  }

  try {
    const payload = await request.json()
    const summaryId = payload.summaryId
    const pdfUrl = payload.pdfUrl
    const whatsappNumber = payload.whatsappNumber

    if (!summaryId || !pdfUrl || !whatsappNumber) {
      return response({ error: 'Missing approved summary data for WhatsApp delivery.' }, 400)
    }

    const validationUrl = `${supabaseUrl}/rest/v1/discharge_summaries?id=eq.${encodeURIComponent(summaryId)}&select=id,status,patient_name,whatsapp_number,pdf_url`
    const validationResponse = await fetch(validationUrl, {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!validationResponse.ok) {
      return response({ error: 'Could not validate the approved discharge summary.' }, 500)
    }

    const summaryRows = await validationResponse.json()
    const summary = Array.isArray(summaryRows) ? summaryRows[0] : summaryRows
    if (!summary || summary.status !== 'approved') {
      return response({ error: 'This discharge instruction must be approved before it can be sent.' }, 403)
    }

    const recipient = normalizeWhatsappNumber(String(summary.whatsapp_number || whatsappNumber))
    if (!recipient) {
      return response({ error: 'The patient WhatsApp number is invalid.' }, 400)
    }

    const approvedPdfUrl = String(summary.pdf_url || pdfUrl)
    if (!approvedPdfUrl) {
      return response({ error: 'The approved PDF URL is missing.' }, 400)
    }

    const normalizedFrom = String(twilioWhatsappFrom).replace(/^whatsapp:/i, '').trim()
    const normalizedRecipient = recipient.replace(/^whatsapp:/i, '').trim()
    const authHeader = btoa(`${twilioSid}:${twilioAuthToken}`)
    const twilioBody = new URLSearchParams({
      From: `whatsapp:${normalizedFrom}`,
      To: `whatsapp:${normalizedRecipient}`,
      Body: `Your clinician-approved discharge instructions are attached.`,
      MediaUrl: approvedPdfUrl
    })

    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: twilioBody.toString()
    })

    const twilioData = await twilioResponse.json()
    if (!twilioResponse.ok) {
      return response({
        error: twilioData?.message || 'Twilio WhatsApp send request failed.'
      }, 502)
    }

    return response({
      success: true,
      messageId: twilioData?.sid || null,
      recipient,
      provider: 'twilio-whatsapp'
    })
  } catch (error) {
    return response({
      error: error instanceof Error ? error.message : 'Twilio WhatsApp delivery failed.'
    }, 500)
  }
})
