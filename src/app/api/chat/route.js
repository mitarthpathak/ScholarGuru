
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || 'gsk_your_api_key_here';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a professional medical AI assistant serving as a personal doctor. Your role is to:

1. **Provide accurate, evidence-based health information**
2. **Always prioritize user safety** - redirect to emergency services for life-threatening conditions
3. **Be formal yet compassionate** in your communication style
4. **Never save or store personal health data** - treat each conversation as confidential but temporary
5. **Include clear disclaimers** that you're not a replacement for in-person medical care
6. **Focus on education and guidance** rather than diagnosis

**IMPORTANT SAFETY RULES:**
- For emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise calling emergency services
- Always include "This is not medical advice - consult a healthcare professional"
- Be thorough but clear in your explanations
- Ask follow-up questions when appropriate to better understand the situation
- Provide actionable, safe recommendations

**Communication Style:**
- Professional and formal tone
- Use clear headings and bullet points
- Include relevant emojis for emphasis (🚨 for emergencies, 💡 for tips, etc.)
- Be thorough but not overwhelming

Remember: You are providing information and guidance, not diagnosis or treatment prescriptions.`;

export async function action({ request }) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, response.statusText);
      
      // Fallback response if API fails
      const fallbackResponse = generateFallbackResponse(message);
      return Response.json({ 
        reply: fallbackResponse,
        fallback: true 
      });
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      throw new Error('No response from AI model');
    }

    return Response.json({ 
      reply: aiReply,
      fallback: false 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return fallback response on any error
    const fallbackResponse = generateFallbackResponse(message);
    return Response.json({ 
      reply: fallbackResponse,
      fallback: true 
    });
  }
}

function generateFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  
  // Emergency conditions
  if (/(?:chest pain|heart attack|difficulty breathing|shortness of breath|severe bleeding|unconscious|emergency)/.test(lower)) {
    return `🚨 **EMERGENCY ACTION REQUIRED!**

**Call 911 or your local emergency services immediately.**

**Don't wait - your health is the top priority.**

This appears to be a medical emergency that requires immediate professional attention. Please call emergency services right away or go to the nearest emergency room.

*This is not medical advice - please consult a healthcare professional immediately.*`;
  }
  
  // Common health queries
  if (/(?:headache|fever|cough|cold|flu)/.test(lower)) {
    return `**General Health Guidance**

Based on your query, here are some general health tips:

• **Rest and hydration** are essential for recovery
• **Over-the-counter medications** may help with symptoms
• **Monitor your symptoms** and seek care if they worsen
• **Contact a healthcare provider** if symptoms persist > 3-5 days

**When to See a Doctor:**
- High fever (>103°F/39.4°C)
- Symptoms lasting more than a week
- Difficulty breathing
- Severe pain or discomfort

*This is not medical advice - please consult a healthcare professional for personalized care.*`;
  }
  
  // Default response
  return `**Health Information & Guidance**

Thank you for your health question. While I'm experiencing some technical difficulties with my AI connection, here's some general guidance:

**General Health Tips:**
• Listen to your body and seek medical attention when concerned
• Maintain regular check-ups with healthcare providers
• Keep track of your symptoms and medical history
• Stay informed about your health conditions

**For Specific Concerns:**
- Contact your primary care physician
- Visit an urgent care clinic for non-emergency issues
- Call emergency services for life-threatening situations
- Consider telemedicine options for convenient consultations

*This is not medical advice - please consult a healthcare professional for personalized medical care.*`;
}
