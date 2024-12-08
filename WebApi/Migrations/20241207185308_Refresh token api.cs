using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Refreshtokenapi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0211c496-0982-4165-af0c-62e37e665df6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "409f7a1a-f569-4f86-8dbb-f5569e4fea55");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e8ab7059-f17a-4645-a914-1dbeda4b302a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "12267ba1-b98d-4503-b3fd-0cd31080d806", null, "Administrator", "ADMINISTRATOR" },
                    { "321a605d-2e6e-4aa4-8247-0fe7cd958a9d", null, "Teacher", "TEACHER" },
                    { "5039a749-b9c2-4826-9202-b547841d2f43", null, "Student", "STUDENT" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "12267ba1-b98d-4503-b3fd-0cd31080d806");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "321a605d-2e6e-4aa4-8247-0fe7cd958a9d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5039a749-b9c2-4826-9202-b547841d2f43");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0211c496-0982-4165-af0c-62e37e665df6", null, "Student", "STUDENT" },
                    { "409f7a1a-f569-4f86-8dbb-f5569e4fea55", null, "Administrator", "ADMINISTRATOR" },
                    { "e8ab7059-f17a-4645-a914-1dbeda4b302a", null, "Teacher", "TEACHER" }
                });
        }
    }
}
