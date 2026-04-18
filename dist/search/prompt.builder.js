"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTravelPrompt = buildTravelPrompt;
exports.buildShortTravelPrompt = buildShortTravelPrompt;
function buildTravelPrompt(destination) {
    return `You are a travel data API. Return ONLY a raw JSON object for: "${destination}". No markdown, no backticks, no explanation.

BUDGET: Use LOCAL currency (₹ India, AED Dubai, ¥ Japan, £ UK, € Europe, $ USA, ฿ Thailand). Use REAL 2025 prices.

JSON structure (fill ALL fields, keep strings short):
{
  "name": "City, Country",
  "sights": [
    {"n":"Place name","t":"Type","e":"emoji","r":4.6,"tag":"Must Visit"},
    {"n":"Place name","t":"Type","e":"emoji","r":4.7,"tag":"Hidden Gem"},
    {"n":"Place name","t":"Type","e":"emoji","r":4.5,"tag":"Popular"},
    {"n":"Place name","t":"Type","e":"emoji","r":4.8,"tag":"Iconic"},
    {"n":"Place name","t":"Type","e":"emoji","r":4.6,"tag":"Scenic"},
    {"n":"Place name","t":"Type","e":"emoji","r":4.4,"tag":"Cultural"}
  ],
  "food": [
    {"n":"Dish name","e":"emoji","p":"price range in local currency","d":"max 10 words"},
    {"n":"Dish name","e":"emoji","p":"price range","d":"max 10 words"},
    {"n":"Dish name","e":"emoji","p":"price range","d":"max 10 words"},
    {"n":"Dish name","e":"emoji","p":"price range","d":"max 10 words"}
  ],
  "budget": {
    "sym":"local currency symbol",
    "days":5,
    "hotel":0,
    "food":0,
    "transport":0,
    "activities":0,
    "note":"one money-saving tip max 15 words"
  },
  "videos": [
    {"title":"Video title","ch":"Channel","views":"1M views","e":"emoji"},
    {"title":"Video title","ch":"Channel","views":"500K views","e":"emoji"},
    {"title":"Video title","ch":"Channel","views":"200K views","e":"emoji"}
  ],
  "blogs": [
    {"title":"Blog title","src":"Blog name","e":"emoji","reads":"500K reads"},
    {"title":"Blog title","src":"Blog name","e":"emoji","reads":"200K reads"},
    {"title":"Blog title","src":"Blog name","e":"emoji","reads":"100K reads"}
  ],
  "food_tip":"practical local food tip max 15 words"
}`;
}
function buildShortTravelPrompt(destination) {
    return `Return ONLY a raw JSON object for travel destination "${destination}". No markdown. No backticks. Just JSON.

Use LOCAL currency. Real 2025 prices.

{
  "name":"City, Country",
  "sights":[
    {"n":"Place 1","t":"Type","e":"🏛","r":4.6,"tag":"Must Visit"},
    {"n":"Place 2","t":"Type","e":"🌿","r":4.5,"tag":"Popular"},
    {"n":"Place 3","t":"Type","e":"🎨","r":4.7,"tag":"Hidden Gem"},
    {"n":"Place 4","t":"Type","e":"🏖","r":4.4,"tag":"Scenic"},
    {"n":"Place 5","t":"Type","e":"🍜","r":4.5,"tag":"Cultural"},
    {"n":"Place 6","t":"Type","e":"🏰","r":4.6,"tag":"Iconic"}
  ],
  "food":[
    {"n":"Dish 1","e":"🍛","p":"price","d":"short desc"},
    {"n":"Dish 2","e":"🥘","p":"price","d":"short desc"},
    {"n":"Dish 3","e":"🍲","p":"price","d":"short desc"},
    {"n":"Dish 4","e":"🥗","p":"price","d":"short desc"}
  ],
  "budget":{"sym":"₹","days":4,"hotel":2500,"food":600,"transport":200,"activities":400,"note":"tip here"},
  "videos":[
    {"title":"Title 1","ch":"Channel","views":"1M views","e":"📹"},
    {"title":"Title 2","ch":"Channel","views":"500K views","e":"🎬"},
    {"title":"Title 3","ch":"Channel","views":"200K views","e":"▶️"}
  ],
  "blogs":[
    {"title":"Blog 1","src":"Source","e":"📖","reads":"500K reads"},
    {"title":"Blog 2","src":"Source","e":"✍️","reads":"200K reads"},
    {"title":"Blog 3","src":"Source","e":"🌐","reads":"100K reads"}
  ],
  "food_tip":"practical tip here"
}

Fill ALL values with real data for ${destination}. Return ONLY the JSON.`;
}
//# sourceMappingURL=prompt.builder.js.map