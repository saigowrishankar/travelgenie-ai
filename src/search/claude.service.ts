// // src/search/claude.service.ts
// import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import axios, { AxiosError } from 'axios';
// import { buildTravelPrompt } from './prompt.builder';

// @Injectable()
// export class ClaudeService {
//   private readonly logger = new Logger(ClaudeService.name);
//   private readonly apiKey: string;
//   private readonly apiUrl = 'https://api.anthropic.com/v1/messages';
//   private readonly model = 'claude-sonnet-4-20250514';

//   constructor(private readonly config: ConfigService) {
//     this.apiKey = config.get<string>('ANTHROPIC_API_KEY', '');
//     if (!this.apiKey) {
//       this.logger.warn(
//         'ANTHROPIC_API_KEY not set — searches will fail. Add it to .env',
//       );
//     }
//   }

//   async fetchDestinationData(destination: string): Promise<Record<string, any>> {
//     if (!this.apiKey) {
//       throw new HttpException(
//         'ANTHROPIC_API_KEY not set. Open .env and paste your key.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     let rawText: string;

//     try {
//       const response = await axios.post(
//         this.apiUrl,
//         {
//           model: this.model,
//           max_tokens: 1500,
//           messages: [
//             { role: 'user', content: buildTravelPrompt(destination) },
//           ],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'anthropic-version': '2023-06-01',
//             'x-api-key': this.apiKey,
//           },
//           timeout: 30_000,
//         },
//       );

//       rawText = (response.data.content as any[])
//         .map((b: any) => b.text ?? '')
//         .join('');
//     } catch (err) {
//       const axErr = err as AxiosError;
//       if (axErr.code === 'ECONNABORTED' || axErr.message?.includes('timeout')) {
//         throw new HttpException(
//           'Request timed out — please try again',
//           HttpStatus.GATEWAY_TIMEOUT,
//         );
//       }
//       const status = axErr.response?.status ?? 502;
//       throw new HttpException(
//         `Claude API error ${status} — check your API key in .env`,
//         HttpStatus.BAD_GATEWAY,
//       );
//     }

//     // Extract JSON from the response text
//     const match = rawText.match(/\{[\s\S]*\}/);
//     if (!match) {
//       throw new HttpException(
//         'Could not parse AI response',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     let data: Record<string, any>;
//     try {
//       data = JSON.parse(match[0]);
//     } catch {
//       throw new HttpException(
//         'Invalid JSON from AI',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     // Deduplicate sights (same logic as original Python)
//     const seen = new Set<string>();
//     const unique: any[] = [];
//     for (const sight of data.sights ?? []) {
//       if (!seen.has(sight.n)) {
//         seen.add(sight.n);
//         unique.push(sight);
//       }
//     }
//     data.sights = unique.slice(0, 6);

//     return data;
//   }
// }
