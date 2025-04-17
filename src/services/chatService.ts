import { knowledgeBaseData } from "@/data/knowledgeBaseData";

export const generateChatResponse = (userText: string): string => {
  const lowerText = userText.toLowerCase();
  let response = "";
  let knowledgeMatch = false;
  
  // Check knowledge base first
  for (const entry of knowledgeBaseData) {
    if (lowerText.includes(entry.topic.toLowerCase())) {
      response = entry.content;
      knowledgeMatch = true;
      break;
    }
  }
  
  if (!knowledgeMatch) {
    // Health topics
    if (lowerText.includes("headache") || lowerText.includes("migraine")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Headaches")?.content || 
        "Headaches can be caused by many factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers can help. If you experience frequent or severe headaches, please consult a healthcare provider.";
    } else if (lowerText.includes("sleep") || lowerText.includes("insomnia") || lowerText.includes("tired")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Sleep")?.content || 
        "Quality sleep is essential for both physical and mental health. Try maintaining a consistent sleep schedule, creating a relaxing bedtime routine, limiting screen time before bed, and ensuring your sleep environment is comfortable. If sleep problems persist, consider speaking with a healthcare provider.";
    } else if (lowerText.includes("diet") || lowerText.includes("nutrition") || lowerText.includes("eating")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Nutrition")?.content || 
        "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats supports overall health. Try to minimize processed foods and added sugars. Remember, moderation is key, and individual nutritional needs may vary. Consider consulting a registered dietitian for personalized advice.";
    }
    // Mental fitness topics
    else if (lowerText.includes("stress") || lowerText.includes("anxiety") || lowerText.includes("anxious")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Stress Management")?.content || 
        "Stress and anxiety are common experiences. Techniques like deep breathing, mindfulness meditation, physical activity, and connecting with supportive people can help manage these feelings. If anxiety is interfering with your daily life, professional support from a therapist or counselor can be beneficial.";
    } else if (lowerText.includes("depress") || lowerText.includes("sad") || lowerText.includes("low mood")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Mental Health")?.content || 
        "I'm sorry to hear you're feeling this way. Talking to someone you trust, engaging in activities you enjoy, physical exercise, and maintaining regular routines can help with low mood. If these feelings persist or are affecting your daily functioning, please reach out to a mental health professional for support.";
    } else if (lowerText.includes("mindful") || lowerText.includes("meditat")) {
      response = "Mindfulness and meditation can help reduce stress, improve focus, and promote emotional well-being. Even just a few minutes of quiet reflection or focused breathing each day can make a difference. There are many apps and online resources available to guide you through different meditation techniques.";
    }
    // Menstrual health topics
    else if (lowerText.includes("period") || lowerText.includes("menstrual") || lowerText.includes("menstruation")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Menstrual Health")?.content || 
        "Menstrual cycles typically occur every 21-35 days and last 2-7 days, though this varies person to person. Common symptoms include cramping, bloating, and mood changes. Regular tracking can help identify patterns and manage symptoms. If you experience very heavy bleeding, severe pain, or significant disruptions to your daily life, consider consulting a healthcare provider.";
    } else if (lowerText.includes("pms") || lowerText.includes("premenstrual")) {
      response = "Premenstrual syndrome (PMS) can include physical and emotional symptoms that occur before your period. Regular exercise, adequate sleep, staying hydrated, and eating balanced meals may help manage symptoms. Some people also find relief with over-the-counter pain relievers or heat therapy for cramps. If symptoms significantly impact your life, talk to a healthcare provider about additional options.";
    } else if (lowerText.includes("cramp") && (lowerText.includes("period") || lowerText.includes("menstrual"))) {
      response = "Menstrual cramps are caused by uterine contractions and are a common experience. Over-the-counter pain relievers, heat therapy (like a heating pad), gentle exercise, and staying hydrated may help relieve discomfort. If you experience severe cramping that interferes with daily activities, consider consulting a healthcare provider.";
    }
    // Exercise topics
    else if (lowerText.includes("exercise") || lowerText.includes("workout") || lowerText.includes("fitness")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Exercise")?.content || 
        "Regular physical activity offers numerous benefits for both physical and mental health. Aim for a mix of cardio, strength training, and flexibility exercises. Start gradually if you're new to exercise, and find activities you enjoy to make it sustainable. Remember that even short periods of movement throughout the day can be beneficial.";
    }
    // General health topics
    else if (lowerText.includes("water") || lowerText.includes("hydration") || lowerText.includes("drink")) {
      response = knowledgeBaseData.find(entry => entry.topic === "Hydration")?.content || 
        "Staying well-hydrated is crucial for overall health. Water helps regulate body temperature, keeps joints lubricated, prevents infections, delivers nutrients to cells, and keeps organs functioning properly. Most adults should aim for 8-10 cups (64-80 ounces) of water daily, adjusting for activity level, climate, and individual needs.";
    } else if (lowerText.includes("vitamin") || lowerText.includes("mineral") || lowerText.includes("supplement")) {
      response = "Vitamins and minerals are essential nutrients that support various bodily functions. While a balanced diet is the best source of these nutrients, supplements may be beneficial in certain cases. It's best to consult with a healthcare provider before starting any supplement regimen, as some may interact with medications or be inappropriate for certain conditions.";
    } else if (lowerText.includes("weight") || lowerText.includes("obesity") || lowerText.includes("bmi")) {
      response = "Maintaining a healthy weight involves balanced nutrition, regular physical activity, adequate sleep, and stress management. Focus on sustainable lifestyle changes rather than quick fixes. Remember that weight is just one aspect of health, and factors like muscle mass, fitness level, and metabolic health are also important. Consider consulting with healthcare providers for personalized guidance.";
    }
    // Mental health topics
    else if (lowerText.includes("therapy") || lowerText.includes("counseling") || lowerText.includes("therapist")) {
      response = "Therapy or counseling can be beneficial for many mental health concerns, life transitions, or personal growth. Different approaches work for different people - cognitive behavioral therapy, mindfulness-based therapy, and psychodynamic therapy are just a few options. Finding the right therapist is important; it's okay to speak with a few professionals before deciding who you feel comfortable working with.";
    } else if (lowerText.includes("adhd") || lowerText.includes("attention deficit")) {
      response = "ADHD (Attention-Deficit/Hyperactivity Disorder) involves patterns of inattention, hyperactivity, and impulsivity that can impact daily functioning. Management typically includes a combination of behavioral strategies, educational support, and sometimes medication. If you're concerned about ADHD symptoms, consider speaking with a healthcare provider for proper evaluation and personalized recommendations.";
    }
    // Default responses
    else if (lowerText.includes("hello") || lowerText.includes("hi")) {
      response = "Hello there! How are you feeling today? I'm here to chat about health, wellness, or anything else on your mind.";
    } else if (lowerText.includes("how are you")) {
      response = "I'm just a digital buddy, but I'm here and ready to chat with you about health, wellness, or provide support when needed!";
    } else if (lowerText.includes("name")) {
      response = "I'm ChatBuddy, your AI companion designed to provide support and conversation on topics including health and wellness.";
    } else if (lowerText.includes("thank")) {
      response = "You're very welcome! I'm here anytime you want to chat about health, wellness, or anything else.";
    } else if (lowerText.includes("bye") || lowerText.includes("goodbye")) {
      response = "Goodbye! Take care of yourself and remember I'm here whenever you need to talk.";
    } else if (lowerText.includes("emotion") || lowerText.includes("feeling") || lowerText.includes("mood")) {
      response = "Emotions are an important part of our wellbeing. You can use the Emotion Tracker tab to log and track how you're feeling over time. Would you like to try that now?";
    } else if (lowerText.includes("game") || lowerText.includes("gesture") || lowerText.includes("hand")) {
      response = "I have some interactive hand gesture games available in the Games tab. You can try them out by switching to that tab. Would you like to try that now?";
    } else if (lowerText.includes("knowledge") || lowerText.includes("database") || lowerText.includes("information")) {
      response = "I have a knowledge base tab where you can browse health and wellness information by topic. You can access it by switching to the Knowledge tab.";
    } else {
      // General knowledge response for any other queries
      response = "I'm primarily focused on health and wellness topics, but I'm always happy to chat about anything that's on your mind. Could you tell me more about what you'd like to know?";
    }
  }
  
  return response || "I'm primarily focused on health and wellness topics, but I'm always happy to chat about anything that's on your mind. Could you tell me more about what you'd like to know?";
};
