import app from "./app";
import seedSuperAdmin from "./app/helper/seed";

// Initialize admin on cold start (only runs once per serverless function instance)
// This runs when the module is loaded, which happens once per Vercel function instance
let seedingInProgress: Promise<void> | null = null;

const initializeAdmin = () => {
  if (!seedingInProgress) {
    seedingInProgress = seedSuperAdmin()
      .then(() => {
        console.log("✅ Admin seeding completed");
      })
      .catch((error) => {
        console.error(
          "⚠️ Error seeding admin (may already exist):",
          error.message,
        );
        // Don't throw - admin might already exist, which is fine
      });
  }
  return seedingInProgress;
};

// Start seeding immediately (non-blocking)
// This will run once when the serverless function instance is created
initializeAdmin();

// Export Express app directly - Vercel will automatically handle Express apps
// Vercel detects Express apps and wraps them appropriately
export default app;
