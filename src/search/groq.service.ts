// src/search/gemini.service.ts  (rename to gemini.service.ts in your project)
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { buildTravelPrompt, buildShortTravelPrompt } from './prompt.builder';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger('GroqService');
  private readonly apiKey: string;
  private readonly model = 'llama-3.3-70b-versatile';
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private readonly config: ConfigService) {
    this.apiKey = config.get<string>('GROQ_API_KEY', '');
    if (!this.apiKey) {
      this.logger.warn('GROQ_API_KEY not set — searches will fail.');
    } else {
      this.logger.log(`LLM provider: Groq | model: ${this.model}`);
    }
  }

  private async callGroq(prompt: string, maxTokens: number): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
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
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: 45_000,
      },
    );
    return response.data?.choices?.[0]?.message?.content ?? '';
  }

  private extractJson(rawText: string): string | null {
    if (!rawText || rawText.trim() === '') return null;

    // Try stripping markdown fences first
    const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      return fenceMatch[1].trim();
    }

    // Find outermost { } block
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return rawText.slice(start, end + 1);
    }

    return null;
  }

  async fetchDestinationData(destination: string): Promise<Record<string, any>> {
    if (!this.apiKey) {
      throw new HttpException(
        'GROQ_API_KEY not set. Get a free key at https://console.groq.com',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let rawText = '';

    try {
      // First attempt — full prompt with 2500 tokens
      this.logger.log(`Calling Groq for "${destination}" (attempt 1, 2500 tokens)`);
      rawText = await this.callGroq(buildTravelPrompt(destination), 2500);
      this.logger.debug(`Raw response (first 200): ${rawText.slice(0, 200)}`);
    } catch (err) {
      const axErr = err as AxiosError;
      if (axErr.code === 'ECONNABORTED' || axErr.message?.includes('timeout')) {
        throw new HttpException('Request timed out — please try again', HttpStatus.GATEWAY_TIMEOUT);
      }
      const status = axErr.response?.status ?? 502;
      const detail = (axErr.response?.data as any)?.error?.message ?? '';
      this.logger.error(`Groq API error ${status}: ${detail}`);
      throw new HttpException(`Groq API error ${status}${detail ? ': ' + detail : ''}`, HttpStatus.BAD_GATEWAY);
    }

    // Try to extract + parse JSON
    let jsonStr = this.extractJson(rawText);
    let data: Record<string, any> | null = null;

    if (jsonStr) {
      try {
        data = JSON.parse(jsonStr);
      } catch {
        this.logger.warn(`JSON.parse failed on attempt 1 — response was truncated, retrying with shorter prompt`);
      }
    }

    // If first attempt failed (truncated/bad JSON) — retry with shorter prompt
    if (!data) {
      try {
        this.logger.log(`Calling Groq for "${destination}" (attempt 2 — shorter prompt, 2000 tokens)`);
        rawText = await this.callGroq(buildShortTravelPrompt(destination), 2000);
        this.logger.debug(`Retry raw response (first 200): ${rawText.slice(0, 200)}`);
        jsonStr = this.extractJson(rawText);
        if (jsonStr) {
          data = JSON.parse(jsonStr);
        }
      } catch {
        this.logger.error(`Both attempts failed for "${destination}"`);
      }
    }

    if (!data) {
      this.logger.error(`Final raw text: ${rawText.slice(0, 500)}`);
      throw new HttpException(
        'Could not get valid AI response after 2 attempts — please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Validate required fields
    if (!data.name || !data.sights || !data.budget) {
      throw new HttpException('Incomplete AI response — please try again', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Deduplicate sights
    const seen = new Set<string>();
    const unique: any[] = [];
    for (const sight of data.sights ?? []) {
      if (!seen.has(sight.n)) {
        seen.add(sight.n);
        unique.push(sight);
      }
    }
    data.sights = unique.slice(0, 6);

    return data;
  }
}
