import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import {
  calculateReservePotential,
  calculateProductionForecast,
  calculateShortfallCauseAnalysis,
  generateRecommendations,
  ForecastInput
} from './analysis';
import { generateAIExplanation, chatWithManganeseCopilot } from './ai';
import { User, Report } from './types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'manganese_ai_secure_token_secret_key_2026';

// Helper for JWT generation
function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Auth Middleware (optional for prototype, but verifies header if provided)
function authenticateUser(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
  } catch (err) {
    // expired or invalid token
  }
  next();
}

router.use(authenticateUser);

// ----------------------------------------------------
// 1. AUTHENTICATION APIS
// ----------------------------------------------------
router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User already exists with this email address.' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'mining_engineer',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  const token = generateToken(newUser);
  return res.status(201).json({ user: newUser, token });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  // For demo/prototype, allow instant login for known demo users or default test credentials
  if (!user && email.includes('@')) {
    // Create guest mining engineer user seamlessly
    const guestUser: User = {
      id: `usr-guest-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'mining_engineer',
      createdAt: new Date().toISOString()
    };
    db.users.push(guestUser);
    const token = generateToken(guestUser);
    return res.json({ user: guestUser, token });
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  return res.json({ user, token });
});

router.get('/auth/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user) {
    return res.json({ user });
  }
  // Return default active engineer session if unauthenticated for rapid hackathon review
  return res.json({
    user: db.users[0]
  });
});

// ----------------------------------------------------
// 2. MINING AREAS APIS
// ----------------------------------------------------
router.get('/areas', (req: Request, res: Response) => {
  const areas = db.getAreas();
  return res.json({ areas });
});

router.get('/areas/:id', (req: Request, res: Response) => {
  const area = db.getAreaById(req.params.id);
  if (!area) {
    return res.status(404).json({ error: 'Mining area not found.' });
  }
  return res.json({ area });
});

router.post('/areas', (req: Request, res: Response) => {
  const { name, code, state, district, sizeSqKm, latitude, longitude, activeStatus, isExistingMine } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required.' });
  }

  const newArea = {
    id: `area-${Date.now()}`,
    name,
    code,
    state: state || 'Maharashtra',
    district: district || 'Nagpur',
    sizeSqKm: Number(sizeSqKm) || 10,
    latitude: Number(latitude) || 21.4,
    longitude: Number(longitude) || 79.3,
    activeStatus: activeStatus || 'exploration_target',
    isExistingMine: Boolean(isExistingMine),
    potentialCategory: 'Moderate Potential' as const,
    potentialScore: 65,
    averageGradeMn: 38.0,
    description: 'Custom evaluated manganese mining perimeter block.',
    formation: 'Sausar Group',
    satelliteIndex: 65
  };

  db.miningAreas.push(newArea);
  return res.status(201).json({ area: newArea });
});

// ----------------------------------------------------
// 3. INDICATORS APIS
// ----------------------------------------------------
router.get('/areas/:id/geology', (req: Request, res: Response) => {
  const areaId = req.params.id;
  const indicators = db.getGeologyByArea(areaId);
  return res.json({ areaId, indicators });
});

router.get('/areas/:id/satellite', (req: Request, res: Response) => {
  const areaId = req.params.id;
  const indicators = db.getSatelliteByArea(areaId);
  return res.json({ areaId, indicators, disclaimer: 'SIMULATED SATELLITE DATA / DEMO REMOTE-SENSING DATA' });
});

// ----------------------------------------------------
// 4. PRODUCTION APIS
// ----------------------------------------------------
router.get('/production', (req: Request, res: Response) => {
  const { areaId, range } = req.query;
  const records = db.getProduction(areaId as string, (range as string) || '6m');
  return res.json({ records, disclaimer: 'DEMO DATA' });
});

router.post('/production', (req: Request, res: Response) => {
  const { areaId, date, month, targetMT, actualMT, oreGradePercent, equipmentUptimePercent, weatherCondition, blastingDelaysHours, workingDays, notes } = req.body;
  if (!areaId || !targetMT || !actualMT) {
    return res.status(400).json({ error: 'Missing required production fields.' });
  }

  const newRecord = {
    id: `prod-${Date.now()}`,
    areaId,
    date: date || new Date().toISOString().split('T')[0],
    month: month || new Date().toISOString().substring(0, 7),
    targetMT: Number(targetMT),
    actualMT: Number(actualMT),
    oreGradePercent: Number(oreGradePercent) || 40,
    equipmentUptimePercent: Number(equipmentUptimePercent) || 85,
    weatherCondition: weatherCondition || 'Clear',
    blastingDelaysHours: Number(blastingDelaysHours) || 0,
    workingDays: Number(workingDays) || 26,
    notes: notes || 'Logged by supervisor'
  };

  db.productionRecords.push(newRecord);
  return res.status(201).json({ record: newRecord });
});

// ----------------------------------------------------
// 5. ANALYSIS APIS (RESERVE, FORECAST, SHORTFALL)
// ----------------------------------------------------
router.post('/analysis/reserve', (req: Request, res: Response) => {
  const { areaId } = req.body;
  const area = db.getAreaById(areaId || 'area-a');
  if (!area) {
    return res.status(404).json({ error: 'Area not found.' });
  }

  const geology = db.getGeologyByArea(area.id);
  const satellite = db.getSatelliteByArea(area.id);

  const reserveAnalysis = calculateReservePotential(area, geology, satellite);
  return res.json({ reserveAnalysis, disclaimer: 'Model Estimate / Exploration Priority - Not Confirmed Reserve' });
});

router.post('/analysis/forecast', (req: Request, res: Response) => {
  const input: ForecastInput = {
    areaId: req.body.areaId || 'area-a',
    month: req.body.month || 'Next Month (March 2026)',
    expectedWorkingDays: Number(req.body.expectedWorkingDays) || 26,
    equipmentAvailability: Number(req.body.equipmentAvailability) || 80,
    expectedOreGrade: Number(req.body.expectedOreGrade) || 41.5,
    weatherCondition: req.body.weatherCondition || 'Clear',
    blastingSchedule: req.body.blastingSchedule || 'Moderate Delay',
    targetProductionMT: Number(req.body.targetProductionMT) || 90000
  };

  const area = db.getAreaById(input.areaId) || db.miningAreas[0];
  const forecast = calculateProductionForecast(input, area);

  return res.json({ forecast, disclaimer: 'DEMO PRODUCTION FORECAST' });
});

router.post('/analysis/shortfall', (req: Request, res: Response) => {
  const input: ForecastInput = {
    areaId: req.body.areaId || 'area-a',
    month: req.body.month || 'Next Month (March 2026)',
    expectedWorkingDays: Number(req.body.expectedWorkingDays) || 26,
    equipmentAvailability: Number(req.body.equipmentAvailability) || 80,
    expectedOreGrade: Number(req.body.expectedOreGrade) || 41.5,
    weatherCondition: req.body.weatherCondition || 'Clear',
    blastingSchedule: req.body.blastingSchedule || 'Moderate Delay',
    targetProductionMT: Number(req.body.targetProductionMT) || 90000
  };

  const area = db.getAreaById(input.areaId) || db.miningAreas[0];
  const forecast = calculateProductionForecast(input, area);
  const shortfall = calculateShortfallCauseAnalysis(forecast, input);

  return res.json({ shortfall, forecast, disclaimer: 'DEMO SHORTFALL MODEL ESTIMATE' });
});

// ----------------------------------------------------
// 6. AI EXPLANATION & COPILOT CHAT
// ----------------------------------------------------
router.post('/ai/explain', async (req: Request, res: Response) => {
  try {
    const { areaId, forecastInput } = req.body;
    const area = db.getAreaById(areaId || 'area-a') || db.miningAreas[0];
    const geology = db.getGeologyByArea(area.id);
    const satellite = db.getSatelliteByArea(area.id);

    const reserve = calculateReservePotential(area, geology, satellite);
    const fInput: ForecastInput = {
      areaId: area.id,
      expectedWorkingDays: Number(forecastInput?.expectedWorkingDays) || 26,
      equipmentAvailability: Number(forecastInput?.equipmentAvailability) || 80,
      expectedOreGrade: Number(forecastInput?.expectedOreGrade) || 41.5,
      weatherCondition: forecastInput?.weatherCondition || 'Clear',
      blastingSchedule: forecastInput?.blastingSchedule || 'Moderate Delay',
      targetProductionMT: Number(forecastInput?.targetProductionMT) || 90000
    };

    const forecast = calculateProductionForecast(fInput, area);
    const shortfall = calculateShortfallCauseAnalysis(forecast, fInput);
    const recommendations = generateRecommendations(area, reserve, forecast);

    const explanation = await generateAIExplanation(area, reserve, forecast, shortfall);

    return res.json({
      explanation,
      reserve,
      forecast,
      shortfall,
      recommendations
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'AI explanation failed: ' + err.message });
  }
});

router.post('/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, areaId, forecastInput, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const area = db.getAreaById(areaId || 'area-a') || db.miningAreas[0];
    const geology = db.getGeologyByArea(area.id);
    const satellite = db.getSatelliteByArea(area.id);
    const reserve = calculateReservePotential(area, geology, satellite);

    const fInput: ForecastInput = {
      areaId: area.id,
      expectedWorkingDays: Number(forecastInput?.expectedWorkingDays) || 26,
      equipmentAvailability: Number(forecastInput?.equipmentAvailability) || 80,
      expectedOreGrade: Number(forecastInput?.expectedOreGrade) || 41.5,
      weatherCondition: forecastInput?.weatherCondition || 'Clear',
      blastingSchedule: forecastInput?.blastingSchedule || 'Moderate Delay',
      targetProductionMT: Number(forecastInput?.targetProductionMT) || 90000
    };

    const forecast = calculateProductionForecast(fInput, area);
    const shortfall = calculateShortfallCauseAnalysis(forecast, fInput);

    const reply = await chatWithManganeseCopilot(message, {
      selectedArea: area,
      reserve,
      forecast,
      shortfall,
      history
    });

    return res.json({ reply });
  } catch (err: any) {
    return res.status(500).json({ error: 'Copilot query failed: ' + err.message });
  }
});

// ----------------------------------------------------
// 7. REPORTS APIS
// ----------------------------------------------------
router.get('/reports', (req: Request, res: Response) => {
  const reports = db.getReports();
  return res.json({ reports });
});

router.post('/reports', async (req: Request, res: Response) => {
  const { areaId, reportType, title } = req.body;
  const area = db.getAreaById(areaId || 'area-a') || db.miningAreas[0];
  const geology = db.getGeologyByArea(area.id);
  const satellite = db.getSatelliteByArea(area.id);

  const reserve = calculateReservePotential(area, geology, satellite);
  const fInput: ForecastInput = {
    areaId: area.id,
    expectedWorkingDays: 26,
    equipmentAvailability: 80,
    expectedOreGrade: 41.5,
    weatherCondition: 'Clear',
    blastingSchedule: 'Moderate Delay',
    targetProductionMT: 90000
  };
  const forecast = calculateProductionForecast(fInput, area);
  const shortfall = calculateShortfallCauseAnalysis(forecast, fInput);
  const recommendations = generateRecommendations(area, reserve, forecast);

  const newReport: Report = {
    id: `rep-${Date.now()}`,
    title: title || `${area.name} Intelligence & Forecast Report`,
    areaId: area.id,
    areaName: area.name,
    reportType: reportType || 'Comprehensive Mining Intelligence Report',
    content: {
      summary: `Comprehensive evaluation for ${area.name} indicating Reserve Potential Score of ${reserve.potentialScore}/100 and next month's forecast of ${forecast.expectedProductionMT.toLocaleString()} MT with ${forecast.shortfallRisk} shortfall risk.`,
      reservePotential: reserve,
      productionForecast: forecast,
      shortfallAnalysis: shortfall,
      recommendations
    },
    generatedBy: (req as any).user?.name || 'Dr. Ramesh Sharma (Mining Eng.)',
    createdAt: new Date().toISOString()
  };

  db.saveReport(newReport);
  return res.status(201).json({ report: newReport });
});

// ----------------------------------------------------
// 8. DEMO MODE EXECUTION API
// ----------------------------------------------------
router.post('/demo/run', async (req: Request, res: Response) => {
  const area = db.miningAreas[0]; // Area A (Mansar East Extension)
  const geology = db.getGeologyByArea(area.id);
  const satellite = db.getSatelliteByArea(area.id);
  const reserve = calculateReservePotential(area, geology, satellite);

  const fInput: ForecastInput = {
    areaId: area.id,
    month: 'March 2026',
    expectedWorkingDays: 26,
    equipmentAvailability: 78,
    expectedOreGrade: 41.5,
    weatherCondition: 'Clear',
    blastingSchedule: 'Moderate Delay',
    targetProductionMT: 90000
  };

  const forecast = calculateProductionForecast(fInput, area);
  const shortfall = calculateShortfallCauseAnalysis(forecast, fInput);
  const recommendations = generateRecommendations(area, reserve, forecast);
  const explanation = await generateAIExplanation(area, reserve, forecast, shortfall);

  return res.json({
    mode: 'SIH DEMO / SIMULATION MODE',
    stepCount: 11,
    data: {
      selectedArea: area,
      geology,
      satellite,
      reservePotential: reserve,
      productionHistory: db.getProduction(area.id),
      productionForecast: forecast,
      shortfallAnalysis: shortfall,
      aiExplanation: explanation,
      recommendations
    }
  });
});

export default router;
