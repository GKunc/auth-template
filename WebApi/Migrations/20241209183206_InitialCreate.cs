using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "55e8affe-41ae-4635-ad4b-2c3081f81eb6",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0dfc8564-e998-4970-9839-e865d414bcd2", "AQAAAAIAAYagAAAAEAFO88JVNvImLcO32WFZfyB94gPoqqOlyQj0EwycrbY7Sn1q+FL6WZVUsNXcJCgXTg==", "38fa76bf-ed6d-478b-8081-03092de1b6cd" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "55e8affe-41ae-4635-ad4b-2c3081f81eb6",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "590d12ca-d559-41f1-9e84-8e0f702f2d36", "AQAAAAIAAYagAAAAEL4/5kdq+OzaTUIukodc8DCCPIjttclG3yC3ApCjtT8QgUFPJvWLp5jAJhd81hnr2g==", "09f6af7a-a23f-4376-a1a8-1b8bc9f78fab" });
        }
    }
}
