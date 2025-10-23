import express from "express";
import OpenAI from "openai";
import Property from "../models/Property.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: "AIzaSyCC5jQTv-mtO8nZBcxpg3eIqPxVosj3j-U",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const COMPANY_INFO = {
  name: "roarrealty.ae",
  office: "1507, Al Manara Tower, Business Bay, Dubai, United Arab Emirates",
  phone: "+971 585005438",
  email: "anurag@roarrealty.ae"
};

class AIService {
  static async detectIntent(userMessage) {
    const prompt = `
    Analyze: "${userMessage}"
    Return JSON: {"intent": "property_search|general_chat|company_info", "confidence": 0.1-1.0, "reason": "explanation"}
    
    Examples:
    "hi" → general_chat
    "3 bedroom villa" → property_search
    "contact details" → company_info
    `;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userMessage }
        ]
      });
      
      const response = completion.choices[0]?.message?.content || "{}";
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { intent: "general_chat", confidence: 0.5, reason: "default" };
      
    } catch (error) {
      console.error("Intent detection error:", error);
      return { intent: "general_chat", confidence: 0.3, reason: "error" };
    }
  }

  static async extractFilters(userQuery) {
    const prompt = `
    Extract filters from: "${userQuery}"
    Return JSON: {
      "area": "location",
      "developer": "developer",
      "property_type": "Villa/Apartment",
      "bedrooms": number,
      "bathrooms": number,
      "min_price": number,
      "max_price": number,
      "status": "Ready/Under Construction", "amenities": ["pool", "gym"]
    }
    `;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userQuery }
        ]
      });
      
      const response = completion.choices[0]?.message?.content || "{}";
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const filters = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      
      return FilterService.clean(filters);
      
    } catch (error) {
      console.error("Filter extraction error:", error);
      return {};
    }
  }

  static async generateResponse(intent, userQuery, context = {}) {
    let prompt = "";
    
    switch(intent) {
      case 'property_search':
        prompt = `
        Generate property search response as Shora from roarrealty.ae.
        User: "${userQuery}" | Found: ${context.properties?.length || 0} properties
        Create friendly response highlighting top properties. and chat only in english 
        `;
        break;
        
      case 'company_info':
        prompt = `
        Provide company info as Shora. User: "${userQuery}"
        Company: ${JSON.stringify(COMPANY_INFO)}
        `;
        break;
        
      default:
        prompt = `Generate friendly greeting as Shora from roarrealty.ae. Welcome user and encourage property search.`;
    }
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userQuery }
        ]
      });
      
      return completion.choices[0]?.message?.content || "Hi! I'm Shora from roarrealty.ae. How can I help you find your perfect property?";
      
    } catch (error) {
      console.error("Response generation error:", error);
      return "Hi! I'm Shora from roarrealty.ae. I'm here to help you find the perfect property!";
    }
  }
}

class FilterService {
  static clean(filters) {
    const cleaned = {};
    
    if (filters.area?.trim()) cleaned.area = filters.area.trim();
    if (filters.developer?.trim()) cleaned.developer = filters.developer.trim();
    if (filters.property_type?.trim()) cleaned.property_type = filters.property_type.trim();
    if (filters.bedrooms > 0) cleaned.bedrooms = filters.bedrooms;
    if (filters.bathrooms > 0) cleaned.bathrooms = filters.bathrooms;
    if (filters.min_price > 0) cleaned.min_price = filters.min_price;
    if (filters.max_price > 0) cleaned.max_price = filters.max_price;
    if (filters.status?.trim()) cleaned.status = filters.status.trim();
    if (filters.amenities?.length) cleaned.amenities = filters.amenities;
    
    return cleaned;
  }

  static buildQuery(filters) {
    const query = {};
    
    if (filters.area) query.area = { $regex: new RegExp(filters.area, "i") };
    if (filters.developer) query.developer = { $regex: new RegExp(filters.developer, "i") };
    if (filters.property_type) query.property_type = { $regex: new RegExp(filters.property_type, "i") };
    if (filters.bedrooms) query.bedrooms = filters.bedrooms;
    if (filters.bathrooms) query.bathrooms = filters.bathrooms;
    if (filters.status) query.status = { $regex: new RegExp(filters.status, "i") };
    
    if (filters.min_price || filters.max_price) {
      query.$and = query.$and || [];
      if (filters.min_price && filters.max_price) {
        query.$and.push({
          $or: [{ min_price: { $lte: filters.max_price }, max_price: { $gte: filters.min_price } }]
        });
      }
    }
    
    if (filters.amenities?.length) {
      query.amenities = { $all: filters.amenities.map(a => new RegExp(a, "i")) };
    }
    
    return query;
  }
}

class PropertyService {
  static async search(filters) {
    const query = FilterService.buildQuery(filters);
    
    return await Property.find(query)
      .sort({ status: 1, min_price: 1 })
      .limit(20)
      .select(`
        name area developer property_type bedrooms bathrooms 
        min_price max_price area_sqft status sale_status 
        amenities floor furnished payment_plan description
      `)
      .lean();
  }
}

class ChatHandler {
  static async handlePropertySearch(msg) {
    const filters = await AIService.extractFilters(msg);
    const properties = await PropertyService.search(filters);
    const aiResponse = await AIService.generateResponse('property_search', msg, { properties, filters });

    return {
      success: true,
      intent: 'property_search',
      message: aiResponse,
      search_summary: {
        query: msg,
        filters_applied: filters,
        total_found: properties.length
      },
      properties: properties
    };
  }

  static async handleCompanyInfo(msg) {
    const aiResponse = await AIService.generateResponse('company_info', msg);

    return {
      success: true,
      intent: 'company_info',
      message: aiResponse,
      company_info: COMPANY_INFO
    };
  }

  static async handleGeneralChat(msg) {
    const aiResponse = await AIService.generateResponse('general_chat', msg);

    return {
      success: true,
      intent: 'general_chat',
      message: aiResponse,
      suggestions: [
        "3 bedroom villa in Downtown Dubai",
        "Affordable apartments under 1 crore",
        "Luxury penthouses with sea view",
        "Ready to move properties in Damac Hills"
      ]
    };
  }
}

router.get("/", async (req, res) => {
  try {
    const { msg } = req.query;
    
    if (!msg?.trim()) {
      return res.status(400).json({ 
        error: "Please provide a message!",
        example: "Try: 'Hi' or '3 bedroom villa in Damac Hills'" 
      });
    }

    const intentResult = await AIService.detectIntent(msg.trim());
    let response = {};

    switch(intentResult.intent) {
      case 'property_search':
        response = await ChatHandler.handlePropertySearch(msg);
        break;
        
      case 'company_info':
        response = await ChatHandler.handleCompanyInfo(msg);
        break;
        
      default:
        response = await ChatHandler.handleGeneralChat(msg);
    }

    res.json(response);

  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Hi! I'm Shora from roarrealty.ae. I'm experiencing technical difficulties, but I'm here to help!",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const filterOptions = await Property.aggregate([
      {
        $group: {
          _id: null,
          areas: { $addToSet: "$area" },
          developers: { $addToSet: "$developer" },
          property_types: { $addToSet: "$property_type" },
          statuses: { $addToSet: "$status" },
          bedroom_options: { $addToSet: "$bedrooms" }
        }
      }
    ]);

    const options = filterOptions[0] || {};

    res.json({
      success: true,
      available_filters: {
        areas: (options.areas || []).filter(a => a).sort(),
        developers: (options.developers || []).filter(d => d).sort(),
        property_types: (options.property_types || []).filter(pt => pt).sort(),
        statuses: (options.statuses || []).filter(s => s).sort(),
        bedroom_options: (options.bedroom_options || []).filter(b => b !== null).sort((a, b) => a - b)
      }
    });
  } catch (err) {
    console.error("Filter options error:", err);
    res.status(500).json({ success: false, message: "Could not fetch filter options" });
  }
});

export default router;