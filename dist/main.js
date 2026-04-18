"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const port = process.env.PORT || 8000;
    await app.listen(port);
    console.log(`\n[TravelGenie] Server running on http://localhost:${port}`);
    console.log(`[TravelGenie] Stack: NestJS + PostgreSQL`);
    console.log(`[TravelGenie] API docs: http://localhost:${port}/\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map