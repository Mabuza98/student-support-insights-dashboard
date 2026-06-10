using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Learner
    {
        public int Id { get; set; }

        [Required]
        public string LearnerId { get; set; } = string.Empty;

        [Required]
        public string AgeBand { get; set; } = string.Empty;

        [Required]
        public string Province { get; set; } = string.Empty;

        [Required]
        public string DeviceAccess { get; set; } = string.Empty;

        [Required]
        public string InternetAccess { get; set; } = string.Empty;

        [Range(1, 5)]
        public int DigitalConfidence { get; set; }

        [Range(1, 5)]
        public int ProgrammingConfidence { get; set; }

        [Range(1, 5)]
        public int AiFamiliarity { get; set; }

        [Required]
        public string EmploymentStatus { get; set; } = string.Empty;

        [Required]
        public string SupportNeed { get; set; } = string.Empty;

        [Required]
        public string AttendanceRisk { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        public int RiskScore { get; set; }

        public string RiskLevel { get; set; } = string.Empty;
    }
}