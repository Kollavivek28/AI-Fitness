import PDFDocument from 'pdfkit';
import { PlanResponse, UserProfile } from '../types';

export async function createPlanPdf(plan: PlanResponse, profile: UserProfile): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, info: { Title: `${profile.name} Fitness Plan` } });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString('base64'));
    });

    doc.fontSize(20).text(`${profile.name}'s Personalized Plan`, { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Goal: ${profile.fitnessGoal}`);
    doc.text(`Level: ${profile.fitnessLevel}`);
    doc.text(`Dietary Preference: ${profile.dietaryPreference}`);
    doc.moveDown();

    doc.fontSize(16).text('Workout Plan', { underline: true }).moveDown(0.5);
    plan.workout.forEach((day) => {
      doc.fontSize(14).text(day.day, { underline: true });
      day.exercises.forEach((exercise) => {
        doc.fontSize(11).list(
          [`Exercise: ${exercise.name}`, `Sets: ${exercise.sets}`, `Reps: ${exercise.reps}`, `Rest: ${exercise.rest}`],
          { bulletIndent: 20 },
        );
      });
      doc.moveDown();
    });

    doc.addPage().fontSize(16).text('Diet Plan', { underline: true }).moveDown(0.5);
    plan.diet.forEach((day) => {
      doc.fontSize(14).text(day.day, { underline: true });
      day.meals.forEach((meal) => {
        doc.fontSize(11).list(
          [
            `Meal: ${meal.title}`,
            `Description: ${meal.description}`,
            meal.calories ? `Calories: ${meal.calories}` : '',
          ].filter(Boolean),
        );
      });
      doc.moveDown();
    });

    doc.addPage().fontSize(16).text('AI Tips & Motivation', { underline: true }).moveDown(0.5);
    plan.aiTips.forEach((tip, idx) => doc.fontSize(12).text(`${idx + 1}. ${tip}`).moveDown(0.2));
    if (plan.quote) {
      doc.moveDown().font('Helvetica-Oblique').fontSize(14).text(`Quote: "${plan.quote}"`).font('Helvetica');
    }

    doc.end();
  });
}

