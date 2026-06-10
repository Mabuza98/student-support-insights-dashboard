using backend.Models;

namespace backend.Services
{
    public class RiskService
    {
        public int CalculateRiskScore(Learner l)
        {
            int score = 0;

            if (l.DeviceAccess == "Phone only")
                score += 2;

            if (l.InternetAccess == "Limited")
                score += 2;

            if (l.DigitalConfidence <= 2)
                score += 2;

            if (l.ProgrammingConfidence <= 2)
                score += 2;

            if (l.AiFamiliarity <= 2)
                score += 1;

            if (l.AttendanceRisk == "High")
                score += 3;

            return score;
        }

        public string GetRiskLevel(int score)
        {
            if (score >= 7) return "High";
            if (score >= 4) return "Medium";
            return "Low";
        }
    }
}