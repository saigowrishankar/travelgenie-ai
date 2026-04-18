"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const prompt_builder_1 = require("./prompt.builder");
let GeminiService = class GeminiService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger('GroqService');
        this.model = 'llama-3.3-70b-versatile';
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.apiKey = config.get('GROQ_API_KEY', '');
        if (!this.apiKey) {
            this.logger.warn('GROQ_API_KEY not set — searches will fail.');
        }
        else {
            this.logger.log(`LLM provider: Groq | model: ${this.model}`);
        }
    }
    async callGroq(prompt, maxTokens) {
        const response = await axios_1.default.post(this.apiUrl, {
            model: this.model,
            max_tokens: maxTokens,
            temperature: 0.5,
            messages: [
                {
                    role: 'system',
                    content: 'You are a travel data API. Respond ONLY with a single valid JSON object. No markdown, no backticks, no prose — just the raw JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            timeout: 45_000,
        });
        return response.data?.choices?.[0]?.message?.content ?? '';
    }
    extractJson(rawText) {
        if (!rawText || rawText.trim() === '')
            return null;
        const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            return fenceMatch[1].trim();
        }
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            return rawText.slice(start, end + 1);
        }
        return null;
    }
    async fetchDestinationData(destination) {
        if (!this.apiKey) {
            throw new common_1.HttpException('GROQ_API_KEY not set. Get a free key at https://console.groq.com', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let rawText = '';
        try {
            this.logger.log(`Calling Groq for "${destination}" (attempt 1, 2500 tokens)`);
            rawText = await this.callGroq((0, prompt_builder_1.buildTravelPrompt)(destination), 2500);
            this.logger.debug(`Raw response (first 200): ${rawText.slice(0, 200)}`);
        }
        catch (err) {
            const axErr = err;
            if (axErr.code === 'ECONNABORTED' || axErr.message?.includes('timeout')) {
                throw new common_1.HttpException('Request timed out — please try again', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            const status = axErr.response?.status ?? 502;
            const detail = axErr.response?.data?.error?.message ?? '';
            this.logger.error(`Groq API error ${status}: ${detail}`);
            throw new common_1.HttpException(`Groq API error ${status}${detail ? ': ' + detail : ''}`, common_1.HttpStatus.BAD_GATEWAY);
        }
        let jsonStr = this.extractJson(rawText);
        let data = null;
        if (jsonStr) {
            try {
                data = JSON.parse(jsonStr);
            }
            catch {
                this.logger.warn(`JSON.parse failed on attempt 1 — response was truncated, retrying with shorter prompt`);
            }
        }
        if (!data) {
            try {
                this.logger.log(`Calling Groq for "${destination}" (attempt 2 — shorter prompt, 2000 tokens)`);
                rawText = await this.callGroq((0, prompt_builder_1.buildShortTravelPrompt)(destination), 2000);
                this.logger.debug(`Retry raw response (first 200): ${rawText.slice(0, 200)}`);
                jsonStr = this.extractJson(rawText);
                if (jsonStr) {
                    data = JSON.parse(jsonStr);
                }
            }
            catch {
                this.logger.error(`Both attempts failed for "${destination}"`);
            }
        }
        if (!data) {
            this.logger.error(`Final raw text: ${rawText.slice(0, 500)}`);
            throw new common_1.HttpException('Could not get valid AI response after 2 attempts — please try again', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!data.name || !data.sights || !data.budget) {
            throw new common_1.HttpException('Incomplete AI response — please try again', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const seen = new Set();
        const unique = [];
        for (const sight of data.sights ?? []) {
            if (!seen.has(sight.n)) {
                seen.add(sight.n);
                unique.push(sight);
            }
        }
        data.sights = unique.slice(0, 6);
        return data;
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=groq.service.js.map