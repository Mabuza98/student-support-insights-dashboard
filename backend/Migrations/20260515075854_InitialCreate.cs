using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Learners",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LearnerId = table.Column<string>(type: "TEXT", nullable: false),
                    AgeBand = table.Column<string>(type: "TEXT", nullable: false),
                    Province = table.Column<string>(type: "TEXT", nullable: false),
                    DeviceAccess = table.Column<string>(type: "TEXT", nullable: false),
                    InternetAccess = table.Column<string>(type: "TEXT", nullable: false),
                    DigitalConfidence = table.Column<int>(type: "INTEGER", nullable: false),
                    ProgrammingConfidence = table.Column<int>(type: "INTEGER", nullable: false),
                    AiFamiliarity = table.Column<int>(type: "INTEGER", nullable: false),
                    EmploymentStatus = table.Column<string>(type: "TEXT", nullable: false),
                    SupportNeed = table.Column<string>(type: "TEXT", nullable: false),
                    AttendanceRisk = table.Column<string>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: false),
                    RiskScore = table.Column<int>(type: "INTEGER", nullable: false),
                    RiskLevel = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Learners", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Learners");
        }
    }
}
