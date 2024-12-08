using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshtoken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers");

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
    }
}
