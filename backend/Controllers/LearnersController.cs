using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearnersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly RiskService _riskService;

        public LearnersController(
            AppDbContext context,
            RiskService riskService
        )
        {
            _context = context;
            _riskService = riskService;
        }

        // =====================================
        // GET ALL LEARNERS
        // =====================================

        [HttpGet]
        public async Task<ActionResult<List<Learner>>> GetLearners()
        {
            return await _context.Learners.ToListAsync();
        }

        // =====================================
        // GET SINGLE LEARNER
        // =====================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Learner>> GetLearner(int id)
        {
            var learner = await _context.Learners.FindAsync(id);

            if (learner == null)
            {
                return NotFound(new
                {
                    message = "Learner not found"
                });
            }

            return Ok(learner);
        }

        // =====================================
        // ADD LEARNER
        // =====================================

        [HttpPost]
        public async Task<ActionResult<Learner>> AddLearner(Learner learner)
        {
            // =========================
            // MODEL VALIDATION
            // =========================

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // =========================
            // DUPLICATE CHECK
            // =========================

            var existingLearner = await _context.Learners
                .FirstOrDefaultAsync(
                    l => l.LearnerId == learner.LearnerId
                );

            if (existingLearner != null)
            {
                return BadRequest(new
                {
                    message = "Learner ID already exists"
                });
            }

            // =========================
            // RISK CALCULATION
            // =========================

            learner.RiskScore =
                _riskService.CalculateRiskScore(learner);

            learner.RiskLevel =
                _riskService.GetRiskLevel(
                    learner.RiskScore
                );

            // =========================
            // SAVE
            // =========================

            _context.Learners.Add(learner);

            await _context.SaveChangesAsync();

            return Ok(learner);
        }

        // =====================================
        // UPDATE LEARNER
        // =====================================

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateLearner(
            int id,
            Learner updatedLearner
        )
        {
            if (id != updatedLearner.Id)
            {
                return BadRequest(new
                {
                    message = "ID mismatch"
                });
            }

            var learner = await _context.Learners
                .FindAsync(id);

            if (learner == null)
            {
                return NotFound(new
                {
                    message = "Learner not found"
                });
            }

            // =========================
            // UPDATE FIELDS
            // =========================

            learner.LearnerId =
                updatedLearner.LearnerId;

            learner.AgeBand =
                updatedLearner.AgeBand;

            learner.Province =
                updatedLearner.Province;

            learner.DeviceAccess =
                updatedLearner.DeviceAccess;

            learner.InternetAccess =
                updatedLearner.InternetAccess;

            learner.DigitalConfidence =
                updatedLearner.DigitalConfidence;

            learner.ProgrammingConfidence =
                updatedLearner.ProgrammingConfidence;

            learner.AiFamiliarity =
                updatedLearner.AiFamiliarity;

            learner.EmploymentStatus =
                updatedLearner.EmploymentStatus;

            learner.SupportNeed =
                updatedLearner.SupportNeed;

            learner.AttendanceRisk =
                updatedLearner.AttendanceRisk;

            learner.Notes =
                updatedLearner.Notes;

            // =========================
            // RECALCULATE RISK
            // =========================

            learner.RiskScore =
                _riskService.CalculateRiskScore(learner);

            learner.RiskLevel =
                _riskService.GetRiskLevel(
                    learner.RiskScore
                );

            // =========================
            // SAVE CHANGES
            // =========================

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Learner updated successfully"
            });
        }

        // =====================================
        // DELETE LEARNER
        // =====================================

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLearner(int id)
        {
            var learner = await _context.Learners
                .FindAsync(id);

            if (learner == null)
            {
                return NotFound(new
                {
                    message = "Learner not found"
                });
            }

            _context.Learners.Remove(learner);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Learner deleted successfully"
            });
        }
    }
}