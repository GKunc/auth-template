using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4c64a9dd-97f4-4a0a-b59d-3c1510ff2d7c", null, "Student", "STUDENT" },
                    { "71ec82d8-7e7f-42f0-879b-28e24a88c52e", null, "Teacher", "TEACHER" },
                    { "d3a39635-969a-4a85-9036-4a34ff58673b", null, "Administrator", "ADMINISTRATOR" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4c64a9dd-97f4-4a0a-b59d-3c1510ff2d7c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "71ec82d8-7e7f-42f0-879b-28e24a88c52e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d3a39635-969a-4a85-9036-4a34ff58673b");
        }
    }
}
