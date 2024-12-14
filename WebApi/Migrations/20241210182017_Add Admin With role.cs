using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminWithrole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "9709e011-7150-4380-a8ff-7ce56d6fbf45", "55e8affe-41ae-4635-ad4b-2c3081f81eb6" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "12267ba1-b98d-4503-b3fd-0cd31080d806", "a88d0ad8-82aa-4607-849e-4cdcf96aac86" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a88d0ad8-82aa-4607-849e-4cdcf96aac86",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "93043258-ace8-4f55-a91a-868499115bfb", "AQAAAAIAAYagAAAAEPwybqZ0VwY0vBWm6BSH40CiCNnHlGCpOWi/ivFuj/lP2bYHeGXj+gpspATRcCCNOA==", "6d6d88a6-ab52-4ac7-9ce8-c230d9a5176a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "12267ba1-b98d-4503-b3fd-0cd31080d806", "a88d0ad8-82aa-4607-849e-4cdcf96aac86" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "9709e011-7150-4380-a8ff-7ce56d6fbf45", "55e8affe-41ae-4635-ad4b-2c3081f81eb6" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a88d0ad8-82aa-4607-849e-4cdcf96aac86",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "12a4acc9-d33c-4f43-9d2e-f6b0c2d9dfd0", "AQAAAAIAAYagAAAAEGZutLmQIZhb8FpV88Chr58EqUpZ05lEu1VT+cQVz0AGSFpIpw3d9MycB3IpW+01bA==", "d5055490-f913-4670-b1e4-850d8afd7670" });
        }
    }
}
