const allowedServices = new Set([
  'Environmental Impact Assessment & Authorisations',
  'Environmental Compliance & Monitoring',
  'Water Use Authorisations',
  'Waste Management & Licensing',
  'Mining & Mineral Regulatory Applications',
  'Training & Capacity Building',
  'General enquiry'
])
const contactRecipient = 'info@tondaprojects.co.za'

function readField(body, field, maxLength) {
  const value = body[field]
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength + 1)
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Submit the enquiry as JSON.' })
  }

  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Please submit a valid enquiry.' })
  }

  const name = readField(body, 'name', 120)
  const email = readField(body, 'email', 254)
  const phone = readField(body, 'phone', 30)
  const service = readField(body, 'service', 120)
  const message = readField(body, 'message', 5000)
  const companyWebsite = readField(body, 'companyWebsite', 200)

  if (companyWebsite) {
    return res.status(400).json({ error: 'The enquiry could not be accepted. Please contact Tonda by email.' })
  }

  if (
    name.length < 2 ||
    name.length > 120 ||
    /[\u0000-\u001f\u007f]/.test(name) ||
    !isValidEmail(email) ||
    phone.length > 30 ||
    !/^[+0-9() .-]{7,30}$/.test(phone) ||
    phone.replace(/\D/g, '').length < 7 ||
    !allowedServices.has(service) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: 'Please check the form fields and try again.' })
  }

  const { RESEND_API_KEY, TONDA_TO_EMAIL, TONDA_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || TONDA_TO_EMAIL !== contactRecipient || !TONDA_FROM_EMAIL) {
    console.error('Contact API configuration is missing required values or TONDA_TO_EMAIL does not match the company inbox.')
    return res.status(503).json({
      error: 'The enquiry service is not configured for the company inbox yet. Please email info@tondaprojects.co.za directly.'
    })
  }

  const text = [
    'A new enquiry was submitted on the Tonda Consultancy & Projects website.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Contact number: ${phone}`,
    `Service of interest: ${service}`,
    '',
    'Message:',
    message
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: TONDA_FROM_EMAIL,
        to: [contactRecipient],
        reply_to: email,
        subject: `Website enquiry: ${service}`,
        text
      })
    })

    if (!response.ok) {
      console.error(`Resend rejected a contact enquiry with status ${response.status}.`)
      return res.status(502).json({
        error: 'We could not deliver your enquiry. Please email info@tondaprojects.co.za directly.'
      })
    }

    return res.status(200).json({ message: 'Enquiry sent successfully.' })
  } catch (error) {
    console.error('Unable to reach Resend while sending a contact enquiry.', error)
    return res.status(502).json({
      error: 'We could not reach the enquiry service. Please email info@tondaprojects.co.za directly.'
    })
  }
}
